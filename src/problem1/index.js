// Time Complexity: O(n)
// Space Complexity: O(n)
const sum_to_n_a = function (n) {
  if (n === 1) return 1;
  return n + sum_to_n_b(n - 1);
};
console.log(sum_to_n_a(5));

// Time Complexity: O(n)
// Space Complexity: O(1)
const sum_to_n_b = function (n) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    sum = sum + i;
  }
  return sum;
};
console.log(sum_to_n_b(5));

// Time Complexity: O(1)
// Space Complexity: O(1)
const sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};
console.log(sum_to_n_c(5));
