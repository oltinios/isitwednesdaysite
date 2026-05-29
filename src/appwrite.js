import { Client, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // your endpoint
  .setProject("6a19c866002c092aae75");              // replace this

export const storage = new Storage(client);
export { ID };