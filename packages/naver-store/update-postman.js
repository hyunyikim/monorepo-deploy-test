const POSTMAN_API_KEY =
  "PMAK-642292d5732f346870720ee7-7117e26de86ec0742acb093da543e28343";
const SWAGGER_JSON_URL = "https://dev-api.vircle.co.kr/naver-store/api-json";
const POSTMAN_WORKSPACE = "8ccaafdf-cabb-45c6-8683-1f837a924ece";
const SWAGGER_TITLE = "Naver Store API";

const headers = {
  "X-Api-Key": POSTMAN_API_KEY,
  "Content-Type": "application/json",
};

const getOpenApi = async () => {
  return await (await fetch(SWAGGER_JSON_URL)).json();
};

const createCollection = async () => {
  const openApi = await getOpenApi();

  return await fetch(
    `https://api.getpostman.com/import/openapi?workspace=${POSTMAN_WORKSPACE}`,
    {
      body: JSON.stringify({ type: "json", input: openApi }),
      headers,
      method: "POST",
    }
  ).then((res) => res.json());
};

const deleteCollection = async (collection) => {
  return (
    (
      await (
        await fetch(
          `https://api.getpostman.com/collections/${collection.uid}`,
          {
            headers,
            method: "DELETE",
          }
        )
      ).json()
    ).collection !== undefined
  );
};

const getCollection = async () => {
  const result = await fetch("https://api.getpostman.com/collections", {
    headers,
  });
  const data = await result.json();

  return data.collections.find((d) => d.name === SWAGGER_TITLE);
};

const main = async () => {
  const collection = await getCollection();
  const isDeleted = await deleteCollection(collection);
  const result = isDeleted && (await createCollection());
  console.log(result);
};

main();
