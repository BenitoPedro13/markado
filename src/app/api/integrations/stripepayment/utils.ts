export function mapSearchParamsToQuery(searchParams: URLSearchParams) {
  const query: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = query[key];
    if (existing) {
      query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      query[key] = value;
    }
  });

  return query;
}
