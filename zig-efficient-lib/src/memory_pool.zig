const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;

pub const MemoryPool = struct {
    const Self = @This();
    
    buffer: []u8,
    offset: usize,
    allocator: Allocator,
    
    pub fn init(allocator: Allocator, size: usize) !Self {
        const buffer = try allocator.alloc(u8, size);
        return Self{
            .buffer = buffer,
            .offset = 0,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *Self) void {
        self.allocator.free(self.buffer);
    }
    
    pub fn alloc(self: *Self, comptime T: type, count: usize) ?[]T {
        const size_needed = @sizeOf(T) * count;
        const alignment = @alignOf(T);
        
        const aligned_offset = std.mem.alignForward(usize, self.offset, alignment);
        
        if (aligned_offset + size_needed > self.buffer.len) {
            return null;
        }
        
        const ptr = @as([*]T, @ptrCast(@alignCast(self.buffer.ptr + aligned_offset)));
        self.offset = aligned_offset + size_needed;
        
        return ptr[0..count];
    }
    
    pub fn reset(self: *Self) void {
        self.offset = 0;
    }
    
    pub fn allocOne(self: *Self, comptime T: type) ?*T {
        const slice = self.alloc(T, 1) orelse return null;
        return &slice[0];
    }
};

pub fn processLargeDataset(allocator: Allocator, data: []const f64) !struct {
    sum: f64,
    average: f64,
    processed_count: usize,
} {
    var pool = try MemoryPool.init(allocator, 1024 * 1024);
    defer pool.deinit();
    
    var sum: f64 = 0.0;
    var processed_count: usize = 0;
    
    const chunk_size = 1000;
    var i: usize = 0;
    
    while (i < data.len) {
        const end = @min(i + chunk_size, data.len);
        const chunk = data[i..end];
        
        const temp_results = pool.alloc(f64, chunk.len) orelse {
            pool.reset();
            const temp_results2 = pool.alloc(f64, chunk.len) orelse return error.OutOfMemory;
            
            for (chunk, 0..) |value, j| {
                temp_results2[j] = value * value;
                sum += temp_results2[j];
            }
            processed_count += chunk.len;
            i = end;
            continue;
        };
        
        for (chunk, 0..) |value, j| {
            temp_results[j] = value * value;
            sum += temp_results[j];
        }
        
        processed_count += chunk.len;
        i = end;
        
        if (pool.offset > pool.buffer.len / 2) {
            pool.reset();
        }
    }
    
    const average = if (processed_count > 0) sum / @as(f64, @floatFromInt(processed_count)) else 0.0;
    
    return .{
        .sum = sum,
        .average = average,
        .processed_count = processed_count,
    };
}

test "memory pool basic allocation" {
    var pool = try MemoryPool.init(testing.allocator, 1024);
    defer pool.deinit();
    
    const integers = pool.alloc(i32, 10).?;
    try testing.expect(integers.len == 10);
    
    const floats = pool.alloc(f64, 5).?;
    try testing.expect(floats.len == 5);
}

test "memory pool reset" {
    var pool = try MemoryPool.init(testing.allocator, 1024);
    defer pool.deinit();
    
    _ = pool.alloc(i32, 100).?;
    const old_offset = pool.offset;
    
    pool.reset();
    try testing.expect(pool.offset == 0);
    try testing.expect(old_offset > 0);
}

test "large dataset processing" {
    const data = [_]f64{ 1.0, 2.0, 3.0, 4.0, 5.0 } ** 1000;
    const result = try processLargeDataset(testing.allocator, &data);
    
    try testing.expect(result.processed_count == 5000);
    try testing.expect(result.sum > 0);
}