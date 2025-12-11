import { apiRoutes } from "@configs";
import axios from "axios";

const baseDomain = import.meta.env.VITE_PUBLIC_FILE_API_BASE_URL;

class FileService {
  uploadFileV2(req: FormData) {
    return axios.post(baseDomain + apiRoutes.uploadFileV2, req);
  }

  downloadFileV2(hash: string) {
    return axios.post(baseDomain + apiRoutes.downloadFileV2, { hash });
  }

  saveOrReplaceFile(
    req: FormData,
    queries: { documentId: number; fileType: string; fileName: string }
  ) {
    return axios.post(
      baseDomain +
        apiRoutes.saveOrReplace +
        `?documentId=${queries.documentId}&fileType=${queries.fileType}&fileName=${queries.fileName}`,
      req
    );
  }
}

export default new FileService();
