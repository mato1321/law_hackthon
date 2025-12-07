import os
import json
import time
import torch
from typing import List, Dict, Any
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import HuggingFacePipeline
from langchain_classic.chains import RetrievalQA
from langchain_core.documents import Document
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    pipeline,
)

os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "7200"  
os.environ["CURL_CA_BUNDLE"] = ""              # 測試時使用
os.environ["TOKENIZERS_PARALLELISM"] = "false" # 單執行緒
class Config:
    DOCUMENTS_DIR = "documents"                # 法規知識庫
    CONTRACTS_DIR = "contracts"                # 契約文件
    LAW_JSON_PATH = "documents/new_law.json"   # 法規文件
    CHUNK_SIZE = 800                           # 把法條切塊
    CHUNK_OVERLAP = 100                        # 避免語意不連續
    EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
    LLM_MODEL_NAME = "yentinglin/Taiwan-LLM-7B-v2.1-chat"
    VECTOR_DB_DIR = "lawvector_db"             # 向量庫位置
    TOP_K = 5                                  # 找出幾條相關的
    USE_4BIT_QUANTIZATION = False              # 要不要量化

class LaborContractReviewSystem:               # 外籍勞工契約審查
    def __init__(self, config: Config):
        self.config = config
        self.embeddings = None
        self.llm = None
        self.vector_db = None
        self.qa_chain = None
        os.makedirs(config.DOCUMENTS_DIR, exist_ok=True)
        os.makedirs(config.CONTRACTS_DIR, exist_ok=True)
        self._init_embeddings()
        self._init_llm()
    
    def _init_embeddings(self):
        print(f"載入向量模型")
        max_retries = 3
        for attempt in range(max_retries):
            try:
                self.embeddings = HuggingFaceEmbeddings(
                    model_name=self.config.EMBEDDING_MODEL_NAME,
                    model_kwargs={
                        'device': 'cuda' if torch.cuda.is_available() else 'cpu',
                        'trust_remote_code': True  
                    },
                    encode_kwargs={
                        'normalize_embeddings': True,  # 做正規劃
                        'batch_size': 16 
                    }
                )
                break
            except Exception as e:
                print(f"Failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(5)
                else:
                    raise
        print("Successful\n")
    
    def _init_llm(self):
        print(f"載入LLM")
        max_retries = 3
        for attempt in range(max_retries):
            try:
                tokenizer = AutoTokenizer.from_pretrained(
                    self.config.LLM_MODEL_NAME,
                    trust_remote_code=True,
                    resume_download=True
                )
                if tokenizer.pad_token is None:  #方便批次處理
                    tokenizer.pad_token = tokenizer.eos_token
                model = AutoModelForCausalLM.from_pretrained(
                    self.config.LLM_MODEL_NAME,
                    device_map="auto",
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    trust_remote_code=True,  # 允許模型用他們自己的Python code
                    resume_download=True     # 下載中斷，會從斷點續傳 
                )
                pipe = pipeline(
                    "text-generation",
                    model=model,
                    tokenizer=tokenizer,
                    max_new_tokens=1200,  
                    temperature=0.5,         # 降低預測文字的隨機性
                    repetition_penalty=1.3,  # 降低重複字詞
                    do_sample=True,          # 要不要進行多項式採樣
                    top_p=0.9,              # 控制生成文本多樣性
                    pad_token_id=tokenizer.pad_token_id,
                    eos_token_id=tokenizer.eos_token_id,
                )
                self.llm = HuggingFacePipeline(pipeline=pipe)
                break  
            except Exception as e:
                print(f"失敗: {e}")
                if attempt < max_retries - 1:
                    time.sleep(5)
                else:
                    raise
        if torch.cuda.is_available():
            allocated = torch.cuda.memory_allocated(0) / 1024**3
            print(f"GPU 顯存使用: {allocated:.2f} GB\n")
        print("Successful\n")
    
    def load_law_json(self) -> List[Document]:
        print(f"載入JSON")
        documents = []
        json_files = list(Path(self.config.DOCUMENTS_DIR).glob('*.json'))
        if not json_files:
            print(f"在 {self.config.DOCUMENTS_DIR} 中找不到任何 JSON 檔案")
            return []
        print(f"找到 {len(json_files)} 個 JSON 檔案")

        for json_path in json_files:
            try:
                print(f"正在讀取: {json_path.name}")
                with open(json_path, 'r', encoding='utf-8') as f:
                    law_data = json.load(f)
                if isinstance(law_data, list):
                    for item in law_data:
                        content = self._format_law_item(item)
                        doc = Document(
                            page_content=content,
                            metadata={
                                "source": json_path.name, 
                                "type": "labor_law",
                                **item  
                            }
                        )
                        documents.append(doc)
                elif isinstance(law_data, dict):
                    for law_name, law_content in law_data.items():
                        if isinstance(law_content, list):
                            for item in law_content:
                                content = self._format_law_item(item)
                                doc = Document(
                                    page_content=content,
                                    metadata={
                                        "source": json_path.name, 
                                        "law_name": law_name,
                                        "type": "labor_law"
                                    }
                                )
                                documents.append(doc)
            except Exception as e:
                print(f"讀取 {json_path.name} 失敗: {e}")
                continue 
        return documents
    
    def _format_law_item(self, item: Dict) -> str:  # 格式化法規條文
        parts = []
        if 'instruction' in item and 'input' in item:
            parts.append(f"【問題】{item['instruction']}")
            parts.append(f"【法規依據】{item['input']}")
            if 'output' in item:
                parts.append(f"【說明】{item['output']}")
            return '\n'.join(parts)
        if '法規名稱' in item:
            parts.append(f"【{item['法規名稱']}】")
        if '條號' in item:
            parts. append(f"第 {item['條號']} 條")
        if '條文內容' in item:
            parts.append(item['條文內容'])
        if '說明' in item:
            parts.append(f"說明：{item['說明']}")
        if not parts:
            text = str(item)
            if len(text) > 500:
                text = text[:500] + "..."
            parts.append(text)
        return '\n'.join(parts)
    
    def build_law_knowledge_base(self):
        print("建立法規知識庫")
        law_documents = self.load_law_json()
        if os.path.exists(self.config.DOCUMENTS_DIR):
            print(f"查詢其他法規文件")
            loader = DirectoryLoader(
                self.config.DOCUMENTS_DIR,
                glob="**/*.txt",
                loader_cls=TextLoader,
                loader_kwargs={"encoding": "utf-8"}
            )
            text_documents = loader.load()
            print(f"總共 {len(text_documents)} 份其它文本文件")
            law_documents.extend(text_documents)
        if not law_documents:
            raise ValueError("沒有找到任何法規")
        print(f"\n總共 {len(law_documents)} 份法規文件")
        text_splitter = RecursiveCharacterTextSplitter(   # 分割文本
            chunk_size=self.config.CHUNK_SIZE,
            chunk_overlap=self.config.CHUNK_OVERLAP,
            separators=["\n\n", "\n", "。", "；", "，", " ", ""],
            length_function=len,
            is_separator_regex=False
        )
        texts = text_splitter.split_documents(law_documents)
        self.vector_db = Chroma.from_documents(          # 4.創建向量庫
            documents=texts,
            embedding=self.embeddings,
            persist_directory=self.config.VECTOR_DB_DIR,
            collection_name="law_collection"
        )
        self._create_qa_chain()
        print(f"\n知識庫建立完成")
    
    def _create_qa_chain(self):                         # 問答檢索鏈
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_db.as_retriever(
                search_type="similarity",
                search_kwargs={"k": self.config.TOP_K}
            ),
            return_source_documents=True,
            verbose=False
        )
    
    def load_existing_knowledge_base(self) -> bool:
        if os.path.exists(self.config.VECTOR_DB_DIR):
            print(f"\n已經有現有知識庫")
            try:
                self.vector_db = Chroma(
                    persist_directory=self.config.VECTOR_DB_DIR,
                    embedding_function=self.embeddings,
                    collection_name="law_collection"
                )
                self._create_qa_chain()
                print("Successful\n")
                return True
            except Exception as e:
                print(f"Failed: {e}\n")
                return False
        return False
    
    def review_contract(self, contract_path: str) -> Dict[str, Any]:
        print(f"審查契約")
        try:  # 讀取契約內容
            with open(contract_path, 'r', encoding='utf-8') as f:
                contract_content = f.read()
        except Exception as e:
            return {"Failed ": f"{e}"}
        

        review_questions = [                                        # 構造審查問題(可新增更多角度最多五個)
            """
                你是台灣勞動法專家，請審查以下外籍勞工契約。

                【契約內容】
                {contract_content}

                【審查任務】
                請逐項檢查並以此格式回答：

                合法項目
                - [列出符合法規的條款]

                違法項目
                - [列出違法條款，格式：違法內容 | 違反法條 | 罰則]

                建議修改
                - [列出需改進的條款]

                重點檢查：
                1. 工資是否 ≥ 27,470元
                2. 工時是否 ≤ 8小時/日、40小時/週
                3. 休假是否符合每週至少1日
                4. 違約金是否合理
                5. 是否投保勞健保

                只根據契約實際內容回答，不要推測。,
            """
            f"請根據台灣勞動法規，審查以下外籍勞工契約是否合法合規：\n\n{contract_content[:1000]}...\n\n請特別檢查：\n1.工資是否符合最低工資標準\n2.工時是否符合勞基法規定\n3.休假制度是否完整\n4.是否有不合理的違約金條款",
            
            f"這份契約中是否存在對勞工不利的條款？請列舉具體條款並說明問題所在：\n\n{contract_content}",
            
            f"根據《就業服務法》和《勞動基準法》，評估此契約的合規性：\n\n{contract_content}"
        ]
        results = {
            "contract_path": contract_path,
            "contract_length": len(contract_content),
            "reviews": [],
            "related_laws": []
        }
        
        for idx, question in enumerate(review_questions, 1):        # 執行多角度審查
            print(f"執行審查")
            try:
                start_time = time.time()
                result = self.qa_chain.invoke({"query": question})  # RAG：找法條  LLM：寫法律分析
                end_time = time.time()
                answer = result.get("result", "")                   # LLM 回答
                answer = self._clean_answer(answer)
                
                review_item = {
                    "question_type": f"審查角度 {idx}",
                    "answer": answer,
                    "processing_time": end_time - start_time,
                    "source_laws": []
                }
                
                unique_law_set = set() 
                for doc in result.get("source_documents", []):
                    law_info = {
                        "content": doc.page_content[:300],
                        "source": doc.metadata.get("source", "Unknown"),
                        "metadata": doc.metadata
                    }
                    review_item["source_laws"].append(law_info)  # 每一個審查角度自己參考的法規文件
                    unique_key = f"{law_info['source']}:{id(doc)}"
                    if unique_key not in unique_law_set:         # 所有審查角度用到的法規，但不重複
                        unique_law_set.add(unique_key)
                        results["related_laws"].append(law_info)
                results["reviews"].append(review_item)
                print(f"Successful\n")
            except Exception as e:
                print(f"Failed: {e}\n")
                results["reviews"].append({
                    "question_type": f"審查角度 {idx}",
                    "error": str(e)
                })
        return results
    
    def _clean_answer(self, answer: str) -> str:
        if "Use the following pieces of context" in answer:
            parts = answer.split("Helpful Answer:")
            if len(parts) > 1:
                answer = parts[-1]
        if "Question:" in answer:
            parts = answer.split("Question:")
            if len(parts) > 1:
                answer = parts[0]
        for marker in ["<|im_start|>", "<|im_end|>", "<s>", "</s>"]:
            answer = answer.replace(marker, "")
        return answer.strip()
    
    def batch_review_contracts(self, contracts_dir: str = None):  # 最後會產出一個 report.txt
        if contracts_dir is None:
            contracts_dir = self.config.CONTRACTS_DIR
        print(f"掃描契約目錄")
        contract_files = []

        for ext in ['*.txt', '*.doc', '*.docx']:
            contract_files.extend(Path(contracts_dir).glob(ext))
        if not contract_files:
            print(f"{contracts_dir} 中沒有找到契約文件")
            return []
        print(f"找到 {len(contract_files)} 份契約\n")

        all_results = []
        for idx, contract_file in enumerate(contract_files, 1):
            print(f"審查進度: {idx}/{len(contract_files)}")            
            result = self.review_contract(str(contract_file))
            all_results.append(result)

        return all_results
    
    def generate_review_report(self, results: List[Dict], output_path: str = "report.txt"):
        print(f"生成審查報告")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("外籍勞工契約審查報告\n")
            f.write(f"生成時間: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"審查契約數: {len(results)} 份\n")
            f.write("=" * 80 + "\n\n")
            for idx, result in enumerate(results, 1):
                f.write(f"\n{'#' * 80}\n")
                f.write(f"契約 {idx}: {result.get('contract_path', 'Unknown')}\n")
                f.write(f"{'#' * 80}\n\n")
                if 'error' in result:
                    f.write(f"Failed: {result['error']}\n")
                    continue

                for review_idx, review in enumerate(result.get('reviews', []), 1):   # 寫入審查結果
                    f.write(f"\n{'-' * 80}\n")
                    f.write(f"【{review['question_type']}】\n")
                    f.write(f"{'-' * 80}\n\n")
                    if 'error' in review:
                        f.write(f"Failed: {review['error']}\n")
                    else:
                        f.write(f"{review['answer']}\n\n")
                        f.write(f"處理時間: {review['processing_time']:.2f} 秒\n")
                        f.write(f"參考法規: {len(review. get('source_laws', []))} 條\n")
                
                f.write(f"\n{'=' * 80}\n")
                f.write("參考法規條文\n")
                f.write(f"{'=' * 80}\n\n")
                for law_idx, law in enumerate(result.get('related_laws', []), 1):
                    content = law['content']
                    if len(content) > 300:
                        content = content[:300] + "..."
                    f.write(f"{law_idx}. {content}\n")
                    f.write(f"   來源: {law['source']}\n\n")
        
        print(f"報告已保存至: {output_path}\n")


def main():
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    print("外籍勞工契約審查系統")
    config = Config()
    try:
        system = LaborContractReviewSystem(config)
        if not system.load_existing_knowledge_base():  # 建立法規知識庫
            system.build_law_knowledge_base()
        print("開始審查契約")
        results = system.batch_review_contracts()

        if results:  # 生成報告
            system.generate_review_report(results, "report.txt")
            print("Successful！報告已保存至: report.txt")
            print(f"共審查 {len(results)} 份契約")
    except Exception as e:
        print(f"\nFailed: {e}")
        import traceback
        traceback.print_exc()
if __name__ == "__main__":
    main()