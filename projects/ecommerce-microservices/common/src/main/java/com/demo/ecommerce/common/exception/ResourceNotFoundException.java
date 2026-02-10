package com.demo.ecommerce.common.exception;

/**
 * โยนเมื่อหา resource ไม่เจอ (404)
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with id: " + id);
    }
}
