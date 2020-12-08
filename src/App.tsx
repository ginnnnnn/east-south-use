import React from "react";
import XLSX from "xlsx";

function App() {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // STEP 2: 得到該檔案的 Blob, i.e., e.target.files
    if (e.target.files) {
      const arrayBuffer = (await getArrayBuffer(
        e.target.files[0]
      )) as XLSX.WorkBook;

      const sourseWs = arrayBuffer.Sheets[arrayBuffer.SheetNames[0]];
      const json: [][] = XLSX.utils.sheet_to_json(sourseWs, {
        header: 1,
      });
      console.log(json);
      const arr0 = ["安心加碼GO團客補助申請團客名單(空白)"];
      const arr1 = [
        "序號(請自行增加序號，最少10位))",
        "姓名",
        "身分證字號",
        "出生年月日(西元年yyyy/mm/dd)",
        "聯絡電話",
      ];
      const newJson = json.map((arr: any[], index) => {
        if (index === 0) {
          return arr0;
        }
        if (index === 1) {
          return arr1;
        }
        let dob = "";
        if (arr[3]) {
          const dobArr: string[] = arr[3].split("");
          dob = [
            dobArr.slice(0, 4).join(""),
            dobArr.slice(4, 6).join(""),
            dobArr.slice(6, 8).join(""),
          ].join("/");
        }
        let tel = "";
        if (arr[4]) {
          tel = arr[4]
            .split("")
            .map((s: string, i: number) => {
              if (i === 3) {
                return s + "-";
              }
              if (i === 6) {
                return s + "-";
              }
              return s;
            })
            .join("");
        }

        return [arr[0], arr[1], arr[2], dob, tel];
      });
      // console.log(newJson);
      const ws = XLSX.utils.aoa_to_sheet(newJson);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "dataOutput");
      XLSX.writeFile(wb, "dataOutput.csv");
    }
  }
  function getArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      // STEP 3: 轉成 ArrayBuffer, i.e., reader.result
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        var data = new Uint8Array(reader.result as ArrayBuffer);
        var workbook = XLSX.read(data, { type: "array" });
        resolve(workbook);
      });
      reader.readAsArrayBuffer(file);
    });
  }
  return (
    <div>
      <input
        id="fileSelect"
        type="file"
        accept=".xlsx"
        onChange={handleUpload}
      />
    </div>
  );
}

export default App;
