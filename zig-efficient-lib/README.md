# Zig Efficient Library

A demonstration library showcasing memory-efficient computational algorithms in Zig, designed as an alternative to Java implementations that consume high RAM.

## Features

### Memory-Efficient Algorithms
- **Fibonacci Calculator**: Iterative approach with O(1) space complexity (vs Java's recursive BigInteger)
- **Prime Number Detection**: Optimized trial division with early termination
- **In-Place Sorting**: Bubble sort and quicksort without extra memory allocation
- **Statistical Calculations**: Single-pass algorithms for mean, variance, and standard deviation

### Memory Management
- **Custom Memory Pool**: Pre-allocated buffer for reduced allocation overhead
- **Chunked Processing**: Handle large datasets without loading everything into memory
- **Zero-Copy Operations**: Minimize data copying and temporary allocations

## Memory Comparison: Zig vs Java

| Operation | Java Memory Usage | Zig Memory Usage |
|-----------|------------------|-----------------|
| Fibonacci(50) | ~500 bytes (BigInteger) | 16 bytes (u64) |
| Sort 1000 integers | ~12KB (ArrayList) | 4KB (in-place) |
| Calculate statistics | ~16KB (boxed primitives) | 8KB (native types) |
| Large dataset processing | Full dataset in memory | Chunk-based streaming |

## Building and Running

```bash
# Build the library
zig build

# Run the demo
zig build run

# Run tests
zig build test
```

## Usage Example

```zig
const lib = @import("zig-efficient-lib");

// Memory-efficient fibonacci
const fib = lib.MathUtils.fibonacci(20);

// In-place sorting
var array = [_]i32{3, 1, 4, 1, 5};
lib.MathUtils.quickSort(&array, 0, 4);

// Memory pool for reduced allocations
var pool = try lib.MemoryPool.init(allocator, 1024);
defer pool.deinit();

const integers = pool.alloc(i32, 100).?;
```

## Key Advantages over Java

1. **No Garbage Collector**: Predictable performance without GC pauses
2. **Stack Allocation**: Most computations use stack memory
3. **Zero Abstractions**: Direct hardware access without runtime overhead
4. **Precise Memory Control**: Explicit allocation and deallocation
5. **Compile-time Optimizations**: Dead code elimination and inlining