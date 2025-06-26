export function createFormData(data: Record<string, any>, filenames: Record<string, string>) {
  const form = new FormData();
  for (const key in data) {
    const name = filenames[key];
    if (name) form.append(name, data[key], name);
    else form.append(key, data[key]);
  }
  return form;
}
