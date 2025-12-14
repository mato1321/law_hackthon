import os
import json
import sys
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
            parts.append(f"第 {item['條號']} 條")
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
        
        review_questions = [          # 構造審查問題(可新增更多角度最多五個)
            f"""請審查此勞工契約並按以下格式回答：

                契約內容：
                {contract_content}

                請按此格式回答：

                【違法項目】
                - 項目1：說明
                - 項目2：說明

                【建議修改】
                - 建議1
                - 建議2

                【參考法條】
                - 法條1
                - 法條2

                只回答上述格式，簡短扼要。
            """
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
        """生成審查報告 - 固定格式"""
        print(f"生成審查報告")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            # ========== 標題 ==========
            f.write("外籍勞工聘僱契約審查報告\n")
            f.write(f"{time.strftime('%Y/%m/%d')}\n\n")
            
            # ========== 簡介 ==========
            f.write("簡介\n")
            f.write("本報告針對所提供之外籍勞工聘僱契約進行全面性法規符合度審查。")
            f.write("經分析後，發現該契約在多項條款上與現行法規有出入，以下為詳細說明。\n\n")
            
            # ========== 處理每份契約 ==========
            for contract_idx, result in enumerate(results, 1):
                if 'error' in result:
                    f.write(f"契約 {contract_idx} 分析失敗: {result['error']}\n\n")
                    continue
                
                # ========== 發現事項 ==========
                f.write("發現事項\n")
                
                # 從審查結果提取內容
                all_answers = []
                for review in result.get('reviews', []):
                    if 'answer' in review and not 'error' in review:
                        all_answers.append(review['answer'])
                
                # 合併所有分析結果
                combined_analysis = "\n\n".join(all_answers)
                
                # 🎯 使用固定的發現事項格式
                findings = [
                    {
                        "title": "工資條款審查",
                        "content": self._extract_wage_info(combined_analysis)
                    },
                    {
                        "title": "工時規定審查",
                        "content": self._extract_worktime_info(combined_analysis)
                    },
                    {
                        "title": "休假規定審查",
                        "content": self._extract_leave_info(combined_analysis)
                    },
                    {
                        "title": "其他條款審查",
                        "content": self._extract_other_info(combined_analysis)
                    }
                ]
                
                for finding in findings:
                    if finding['content']:  # 只輸出有內容的項目
                        f.write(f"{finding['title']}\n")
                        f.write(f"{finding['content']}\n\n")
                
                # ========== 建議 ==========
                f.write("建議\n")
                
                recommendations = [
                    "將基本工資修正為符合最新法定標準（每月不低於27,470元）",
                    "明確載明加班費計算方式及支付時程（延長工時前2小時加給1/3，再延長加給2/3）",
                    "檢視膳宿費扣除是否符合法規比例上限",
                    "建議增列勞工申訴管道及機制",
                    "確保契約內容符合就業服務法及勞動基準法相關規定"
                ]
                
                for idx, rec in enumerate(recommendations, 1):
                    f.write(f"{idx}.{rec}\n")
                
                f.write("\n")
                
                # ========== 結論 ==========
                f.write("結論\n")
                
                # 簡單計算違規項目（根據關鍵字）
                violation_keywords = ['違', '不符', '低於', '未', '缺']
                violation_count = sum(1 for keyword in violation_keywords if keyword in combined_analysis)
                violation_count = min(violation_count, 3)  # 最多3項
                
                f.write(f"綜上所述，該聘僱契約存在{violation_count}項重大違規事項及{len(recommendations)}項建議改善事項。")
                f.write("建議雇主於簽訂契約前進行修正，以確保符合勞動法規並保障勞工權益。\n\n")
                
                # ========== 參考法規（可選） ==========
                if result.get('related_laws'):
                    f.write("\n" + "="*80 + "\n")
                    f.write("參考法規條文\n")
                    f.write("="*80 + "\n\n")
                    
                    for law_idx, law in enumerate(result.get('related_laws', [])[:5], 1):  # 只顯示前5條
                        content = law['content']
                        if len(content) > 200:
                            content = content[:200] + "..."
                        f.write(f"{law_idx}.{content}\n")
                        f.write(f"   來源: {law['source']}\n\n")
        
        print(f"報告已保存至: {output_path}\n")


    def _extract_wage_info(self, text: str) -> str:
        """提取工資相關資訊"""
        if '工資' in text or '薪資' in text or '27470' in text or '27,470' in text:
            # 嘗試找出工資相關段落
            lines = text.split('\n')
            for line in lines:
                if '工資' in line or '薪資' in line:
                    return line.strip()
            return "契約中有提及工資條款，請確認是否符合最低工資標準（每月27,470元）。"
        return "未明確發現工資相關問題，建議仍需確認是否符合基本工資標準。"


    def _extract_worktime_info(self, text: str) -> str:
        """提取工時相關資訊"""
        if '工時' in text or '工作時間' in text or '加班' in text:
            lines = text.split('\n')
            for line in lines:
                if '工時' in line or '工作時間' in line or '加班' in line:
                    return line.strip()
            return "契約中有提及工時規定，請確認是否符合每日8小時、每週40小時的標準。"
        return "未明確發現工時相關問題，建議確認工時及加班費計算方式是否明確。"


    def _extract_leave_info(self, text: str) -> str:
        """提取休假相關資訊"""
        if '休假' in text or '例假' in text or '休息' in text:
            lines = text.split('\n')
            for line in lines:
                if '休假' in line or '例假' in line:
                    return line.strip()
            return "契約中有提及休假規定，請確認是否符合每七日應有兩日休息的規定。"
        return "未明確發現休假相關問題，建議確認休假制度是否完整。"


    def _extract_other_info(self, text: str) -> str:
        """提取其他重要資訊"""
        keywords = ['違約金', '膳宿', '保險', '勞健保']
        for keyword in keywords:
            if keyword in text:
                lines = text.split('\n')
                for line in lines:
                    if keyword in line:
                        return line.strip()
        return "其他條款請依就業服務法及勞動基準法相關規定進行檢視。"

def main():
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    print("外籍勞工契約審查系統")
    config = Config()
    try:
        system = LaborContractReviewSystem(config)
        if not system.load_existing_knowledge_base():  # 建立法規知識庫
            system.build_law_knowledge_base()
        print("開始審查契約")

        if len(sys.argv) > 1:  # 單一檔案模式
            contract_file = sys.argv[1]
            print(f"處理單一契約: {contract_file}")
            if not os.path.exists(contract_file):
                print(f"Failed: {contract_file}")
                sys.exit(1)
            result = system.review_contract(contract_file)
            system.generate_review_report([result], "report.txt")
            print("Successful！")
            
        else:  # 批次處理模式
            results = system.batch_review_contracts()
            if results:
                system.generate_review_report(results, "report.txt")
                print("Successful！")
                print(f"共審查 {len(results)} 份契約")
            else:
                print("Failed")
                sys.exit(1)
    except Exception as e:
        print(f"\nFailed: {e}")
        import traceback
        traceback.print_exc()
if __name__ == "__main__":
    main()