const sharp = require('sharp');

class ImageProcessor {
  // Process avatar image
  static async processAvatar(buffer) {
    try {
      const processedBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 80,
          progressive: true
        })
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      throw new Error(`Avatar processing failed: ${error.message}`);
    }
  }

  // Process thumbnail
  static async processThumbnail(buffer, size = 150) {
    try {
      const processedBuffer = await sharp(buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 70,
          progressive: true
        })
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      throw new Error(`Thumbnail processing failed: ${error.message}`);
    }
  }

  // Get image metadata
  static async getImageInfo(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels
      };
    } catch (error) {
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }

  // Validate image
  static async validateImage(buffer) {
    try {
      const info = await this.getImageInfo(buffer);
      
      // Check file size (5MB limit)
      if (info.size > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds 5MB limit');
      }

      // Check dimensions (max 4000x4000)
      if (info.width > 4000 || info.height > 4000) {
        throw new Error('Image dimensions too large (max 4000x4000)');
      }

      // Check format
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
      if (!allowedFormats.includes(info.format.toLowerCase())) {
        throw new Error(`Unsupported format: ${info.format}. Allowed: ${allowedFormats.join(', ')}`);
      }

      return {
        valid: true,
        info
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Create multiple sizes
  static async createMultipleSizes(buffer) {
    try {
      const [avatar, thumbnail, small] = await Promise.all([
        this.processAvatar(buffer),
        this.processThumbnail(buffer, 150),
        this.processThumbnail(buffer, 50)
      ]);

      return {
        avatar,
        thumbnail,
        small
      };
    } catch (error) {
      throw new Error(`Failed to create multiple sizes: ${error.message}`);
    }
  }
}

module.exports = ImageProcessor;