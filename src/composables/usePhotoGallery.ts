import { ref, onMounted, watch } from 'vue';
import { Plugins, CameraResultType, CameraSource, CameraPhoto, 
Capacitor, FilesystemDirectory } from "@capacitor/core";
const photos = ref<Photo[]>([]);

export interface Photo {
    filepath: string;
    webviewPath?: string;
}

export function usePhotoGallery() {
    const { Camera } = Plugins;
  
    const takePhoto = async (id: any, gallery: boolean) => {
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 100
      });
      const fileName = !gallery ? id +'.jpeg' : new Date().getTime() + id + '_.jpeg';
        const savedFileImage = {
        filepath: fileName,
        webviewPath: cameraPhoto.dataUrl
      };
      photos.value = [savedFileImage, ...photos.value ];
      return savedFileImage
    };
    
    return {
      photos,
      takePhoto
    };
  }