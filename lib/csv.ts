import Papa from "papaparse";

export interface Student {
  regNo: string;
  name: string;
  email: string;
  phone: string;
  shortReg: string; // Last 4 digits
  group: string; // First 2 of the last 4
}

export const parseStudentsCSV = (csvText: string): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV Parse Errors:", results.errors);
        }

        const students: Student[] = results.data
          .map((row: any) => {
            const regNo = row.registration_number?.trim() || "";
            if (regNo.length < 4) return null; // Invalid reg no

            const shortReg = regNo.slice(-4);
            const group = shortReg.slice(0, 2);

            return {
              regNo,
              name: row.name?.trim() || "Unknown",
              email: row.email?.trim() || "",
              phone: row.phone?.trim() || "",
              shortReg,
              group,
            };
          })
          .filter((s): s is Student => s !== null);

        resolve(students);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};
