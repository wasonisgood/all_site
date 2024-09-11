import pandas as pd

def export_excel_sheets_to_csv(excel_file, output_folder):
    # 使用 pandas 讀取 Excel 檔案，使用 openpyxl 作為引擎
    excel_data = pd.ExcelFile(excel_file, engine='openpyxl')
    
    # 取得所有工作表名稱
    sheet_names = excel_data.sheet_names
    
    # 遍歷每個工作表，並將其匯出為單獨的 CSV 檔案
    for idx, sheet_name in enumerate(sheet_names):
        # 讀取當前的工作表
        sheet_data = pd.read_excel(excel_file, sheet_name=sheet_name, engine='openpyxl')
        
        # 建立 CSV 檔案名稱，按照順序命名 1.csv, 2.csv, 3.csv, 4.csv
        csv_file_name = f"{output_folder}/{idx+1}.csv"
        
        # 將當前工作表儲存為 CSV
        sheet_data.to_csv(csv_file_name, index=False, encoding='utf-8-sig')
        
        print(f"已匯出工作表: {sheet_name} -> {csv_file_name}")

# 指定 Excel 檔案路徑和輸出資料夾
excel_file = '111.xlsx'  # 這裡放你的試算表檔案名稱
output_folder = '111'  # 這裡放你的輸出資料夾路徑

# 匯出所有工作表為 CSV
export_excel_sheets_to_csv(excel_file, output_folder)
