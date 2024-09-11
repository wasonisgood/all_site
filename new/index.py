import pandas as pd

def clean_and_merge_csv_to_json(csv_files, output_file):
    # 初始化空的 DataFrame
    merged_data = pd.DataFrame()

    # 讀取每個 CSV 檔案
    for file in csv_files:
        # 讀取 CSV 檔案，跳過前幾行的描述部分
        data = pd.read_csv(file, skiprows=2)  # 跳過前2行，因為前2行是描述性的資料
        
        # 確認資料是否有包含額外的列，並根據實際的欄位數量命名欄位
        if len(data.columns) == 13:
            data.columns = ['機關名稱', '宣導項目、標題及內容', '標案/契約名稱', '媒體類型', '宣導期程', 
                            '執行單位', '預算來源', '預算科目', '執行金額', '受委託廠商名稱', 
                            '預期效益', '刊登或託播對象', '備註']
        else:
            raise ValueError(f"{file} 的欄位數量不符合預期，應該是 13 列，但有 {len(data.columns)} 列")

        # 填補「機關名稱」為空值的欄位
        data['機關名稱'].fillna('司法院', inplace=True)
        
        # 移除所有空行
        data_cleaned = data.dropna(how='all')
        
        # 合併資料
        merged_data = pd.concat([merged_data, data_cleaned], ignore_index=True)

    # 將合併後的 DataFrame 轉換為 JSON 格式
    json_data = merged_data.to_json(orient='records', force_ascii=False)
    
    # 儲存為 JSON 檔案
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json_file.write(json_data)

    print(f"合併並清洗完成的資料已轉換成 JSON：{output_file}")

# 指定 CSV 檔案路徑
csv_files = ['111/1.csv', '111/2.csv', '111/3.csv', '111/4.csv']
# 指定輸出的 JSON 檔案路徑
output_file = 'merged_cleaned_data.json'

# 執行清洗、合併並轉換為 JSON
clean_and_merge_csv_to_json(csv_files, output_file)
