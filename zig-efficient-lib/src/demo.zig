const std = @import("std");
const lib = @import("lib.zig");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.debug.print("=== Zig Efficient Library Demo ===\n\n");

    std.debug.print("1. Fibonacci Calculation (Memory-efficient iterative approach)\n");
    const fib_10 = lib.MathUtils.fibonacci(10);
    const fib_20 = lib.MathUtils.fibonacci(20);
    std.debug.print("   fib(10) = {}\n", .{fib_10});
    std.debug.print("   fib(20) = {}\n\n", .{fib_20});

    std.debug.print("2. Prime Number Check (Optimized algorithm)\n");
    const primes_to_check = [_]u64{ 17, 97, 100, 1009 };
    for (primes_to_check) |num| {
        const is_prime = lib.MathUtils.isPrime(num);
        std.debug.print("   {} is prime: {}\n", .{ num, is_prime });
    }
    std.debug.print("\n");

    std.debug.print("3. In-place Sorting (No extra memory allocation)\n");
    var test_array = [_]i32{ 64, 34, 25, 12, 22, 11, 90 };
    std.debug.print("   Before: {any}\n", .{test_array});
    lib.MathUtils.bubbleSort(&test_array);
    std.debug.print("   After:  {any}\n\n", .{test_array});

    std.debug.print("4. Quick Sort (In-place, log(n) stack usage)\n");
    var quick_array = [_]i32{ 3, 6, 8, 10, 1, 2, 1 };
    std.debug.print("   Before: {any}\n", .{quick_array});
    lib.MathUtils.quickSort(&quick_array, 0, @as(isize, @intCast(quick_array.len - 1)));
    std.debug.print("   After:  {any}\n\n", .{quick_array});

    std.debug.print("5. Statistics Calculation (Single pass algorithm)\n");
    const data = [_]f64{ 1.5, 2.8, 3.2, 4.1, 5.7, 2.3, 4.9 };
    const stats = lib.MathUtils.calculateStatistics(&data);
    std.debug.print("   Data: {any}\n", .{data});
    std.debug.print("   Mean: {d:.2}\n", .{stats.mean});
    std.debug.print("   Std Dev: {d:.2}\n", .{stats.std_dev});
    std.debug.print("   Min: {d:.2}, Max: {d:.2}\n\n", .{ stats.min, stats.max });

    std.debug.print("6. Memory Pool Demo (Reduced allocation overhead)\n");
    var pool = try lib.MemoryPool.init(allocator, 4096);
    defer pool.deinit();

    const integers = pool.alloc(i32, 100) orelse return error.OutOfMemory;
    for (integers, 0..) |*item, i| {
        item.* = @as(i32, @intCast(i * i));
    }
    std.debug.print("   Allocated 100 integers in memory pool\n");
    std.debug.print("   First 5: {any}\n", .{integers[0..5]});

    const floats = pool.alloc(f64, 50) orelse return error.OutOfMemory;
    for (floats, 0..) |*item, i| {
        item.* = @as(f64, @floatFromInt(i)) * 3.14;
    }
    std.debug.print("   Allocated 50 floats in same pool\n");
    std.debug.print("   First 3: {d:.2} {d:.2} {d:.2}\n\n", .{ floats[0], floats[1], floats[2] });

    std.debug.print("7. Large Dataset Processing (Memory-efficient chunking)\n");
    var large_data = try allocator.alloc(f64, 10000);
    defer allocator.free(large_data);

    for (large_data, 0..) |*item, i| {
        item.* = @as(f64, @floatFromInt(i % 100)) + 0.5;
    }

    const result = try lib.processLargeDataset(allocator, large_data);
    std.debug.print("   Processed {} elements\n", .{result.processed_count});
    std.debug.print("   Sum of squares: {d:.2}\n", .{result.sum});
    std.debug.print("   Average: {d:.2}\n\n", .{result.average});

    std.debug.print("=== Memory Usage Comparison ===\n");
    std.debug.print("Java equivalent operations would typically:\n");
    std.debug.print("- Use BigInteger for large fibonacci (heap allocation)\n");
    std.debug.print("- Create ArrayList/Collections for sorting (extra memory)\n");
    std.debug.print("- Use boxed primitives (object overhead)\n");
    std.debug.print("- Frequent garbage collection pauses\n");
    std.debug.print("\nZig advantages:\n");
    std.debug.print("- Stack allocation for most operations\n");
    std.debug.print("- No garbage collector overhead\n");
    std.debug.print("- Precise memory control\n");
    std.debug.print("- Zero-cost abstractions\n");
}