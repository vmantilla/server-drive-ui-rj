export function deepEqual(obj1, obj2) {
  const hash1 = JSON.stringify(obj1);
  const hash2 = JSON.stringify(obj2);

  return hash1 === hash2;
}
