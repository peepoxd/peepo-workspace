pub const MathUtils = @import("math_utils.zig").MathUtils;
pub const MemoryPool = @import("memory_pool.zig").MemoryPool;
pub const processLargeDataset = @import("memory_pool.zig").processLargeDataset;

test "run all tests" {
    _ = @import("math_utils.zig");
    _ = @import("memory_pool.zig");
}