import { postJSON, putJSON } from "./http";

interface UpdateProfileRequest {
  name: string;
  email: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<any> {
  return putJSON("user/profile", data);
}
