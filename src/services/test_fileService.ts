interface UploadFileResponse {
  success: boolean;
  message: string;
}

class FileService {
  private file: File;
  constructor(file: File) {
    this.file = file;
  }

  //getFileExtension

  //---------------

  //---------------
  // async upploadFile(){
  async upploadFile(): Promise<UploadFileResponse> {
    //const uploadResponse = await fetch('https://localhost:44383/Api/Contract/addFile',{
    let pathFile = "";
    await fetch("https://localhost:44383/Api/Contract/addFileNew", {
      method: "POST",
      body: this.getFormData(),
    })
      .then((response) => response.json())
      .then((result) => {
        pathFile = result;
      })
      .catch((error) => {
        console.error("error", error);
      });

    return {
      success: true,
      message: pathFile,
    };
  }

  private getFormData(): FormData {
    const formData = new FormData();
    formData.append("Contract", this.file);

    return formData;
  }
}

export default FileService;
