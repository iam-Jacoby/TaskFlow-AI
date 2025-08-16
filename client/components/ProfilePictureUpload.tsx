import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload, Camera, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName: string;
  onImageChange: (imageUrl: string | null) => void;
}

export function ProfilePictureUpload({ currentImage, userName, onImageChange }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setError('');
    setIsUploading(true);

    // Convert to base64 and store in localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      localStorage.setItem('taskflow_avatar', result);
      onImageChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to process image');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    localStorage.removeItem('taskflow_avatar');
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentImage} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Avatar
                </>
              )}
            </Button>
            
            {currentImage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
