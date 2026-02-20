const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;

pub const MathUtils = struct {
    pub fn fibonacci(n: u32) u64 {
        if (n <= 1) return n;
        
        var a: u64 = 0;
        var b: u64 = 1;
        var i: u32 = 2;
        
        while (i <= n) : (i += 1) {
            const temp = a + b;
            a = b;
            b = temp;
        }
        
        return b;
    }
    
    pub fn isPrime(n: u64) bool {
        if (n < 2) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;
        
        var i: u64 = 3;
        while (i * i <= n) : (i += 2) {
            if (n % i == 0) return false;
        }
        
        return true;
    }
    
    pub fn matrixMultiply(allocator: Allocator, a: [][]const f64, b: [][]const f64) ![][]f64 {
        const rows_a = a.len;
        const cols_a = a[0].len;
        const cols_b = b[0].len;
        
        var result = try allocator.alloc([]f64, rows_a);
        for (0..rows_a) |i| {
            result[i] = try allocator.alloc(f64, cols_b);
            for (0..cols_b) |j| {
                result[i][j] = 0.0;
                for (0..cols_a) |k| {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        return result;
    }
    
    pub fn bubbleSort(arr: []i32) void {
        const n = arr.len;
        var i: usize = 0;
        
        while (i < n - 1) : (i += 1) {
            var j: usize = 0;
            while (j < n - i - 1) : (j += 1) {
                if (arr[j] > arr[j + 1]) {
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    pub fn quickSort(arr: []i32, low: isize, high: isize) void {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    fn partition(arr: []i32, low: isize, high: isize) isize {
        const pivot = arr[@as(usize, @intCast(high))];
        var i = low - 1;
        
        var j = low;
        while (j <= high - 1) : (j += 1) {
            if (arr[@as(usize, @intCast(j))] < pivot) {
                i += 1;
                const temp = arr[@as(usize, @intCast(i))];
                arr[@as(usize, @intCast(i))] = arr[@as(usize, @intCast(j))];
                arr[@as(usize, @intCast(j))] = temp;
            }
        }
        
        const temp = arr[@as(usize, @intCast(i + 1))];
        arr[@as(usize, @intCast(i + 1))] = arr[@as(usize, @intCast(high))];
        arr[@as(usize, @intCast(high))] = temp;
        
        return i + 1;
    }
    
    pub fn calculateStatistics(data: []const f64) struct {
        mean: f64,
        variance: f64,
        std_dev: f64,
        min: f64,
        max: f64,
    } {
        var sum: f64 = 0.0;
        var min_val = data[0];
        var max_val = data[0];
        
        for (data) |value| {
            sum += value;
            if (value < min_val) min_val = value;
            if (value > max_val) max_val = value;
        }
        
        const mean = sum / @as(f64, @floatFromInt(data.len));
        
        var variance_sum: f64 = 0.0;
        for (data) |value| {
            const diff = value - mean;
            variance_sum += diff * diff;
        }
        
        const variance = variance_sum / @as(f64, @floatFromInt(data.len));
        const std_dev = @sqrt(variance);
        
        return .{
            .mean = mean,
            .variance = variance,
            .std_dev = std_dev,
            .min = min_val,
            .max = max_val,
        };
    }
};

test "fibonacci calculation" {
    try testing.expect(MathUtils.fibonacci(0) == 0);
    try testing.expect(MathUtils.fibonacci(1) == 1);
    try testing.expect(MathUtils.fibonacci(10) == 55);
}

test "prime number check" {
    try testing.expect(MathUtils.isPrime(2) == true);
    try testing.expect(MathUtils.isPrime(17) == true);
    try testing.expect(MathUtils.isPrime(4) == false);
    try testing.expect(MathUtils.isPrime(1) == false);
}

test "bubble sort" {
    var arr = [_]i32{ 64, 34, 25, 12, 22, 11, 90 };
    MathUtils.bubbleSort(&arr);
    const expected = [_]i32{ 11, 12, 22, 25, 34, 64, 90 };
    try testing.expectEqualSlices(i32, &expected, &arr);
}

test "statistics calculation" {
    const data = [_]f64{ 1.0, 2.0, 3.0, 4.0, 5.0 };
    const stats = MathUtils.calculateStatistics(&data);
    
    try testing.expectApproxEqAbs(@as(f64, 3.0), stats.mean, 0.001);
    try testing.expectApproxEqAbs(@as(f64, 1.0), stats.min, 0.001);
    try testing.expectApproxEqAbs(@as(f64, 5.0), stats.max, 0.001);
}