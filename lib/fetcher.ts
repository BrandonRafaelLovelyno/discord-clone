const fetcher = async (url: string) => {
  const res = await fetch(url);
  const final = await res.json();
  return final;
};

export default fetcher;
