// Iterative Loop (O(n))
// Straightforward approach. 
// It initializes a sum and iterates from 1 up to n, adding each number.
function sum_to_n_iterative(n) {
    let sum = 0;
    // This loop only runs if n >= 1
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Arithmetic Formula (O(1))
// This is the most efficient solution. 
// It uses the Gaussian sum formula for 
// an arithmetic progression: S = (n * (n + 1)) / 2.
function sum_to_n_formula(n) {
    // Use Math.max to handle cases where n <= 0,
    // ensuring the result is 0 for non-positive integers.
    const n_positive = Math.max(0, n);
    return (n_positive * (n_positive + 1)) / 2;
}

// Recursive Approach (O(n))
// This implementation uses recursion, 
// where the function calls itself with a progressively smaller value.
function sum_to_n_recursive(n) {
    // Base case: If n is 0 or negative, the sum is 0.
    if (n <= 0) {
        return 0;
    }
    // Recursive step: n + sum(n-1)
    return n + sum_to_n_recursive(n - 1);
}
