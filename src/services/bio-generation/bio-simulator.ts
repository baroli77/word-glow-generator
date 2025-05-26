
import { BioFormData } from '../../components/bio-generator/types';
import { getPlatformCategory } from '../../components/bio-generator/config/platform-config';

export class BioSimulator {
  private formData: BioFormData;

  constructor(formData: BioFormData) {
    this.formData = formData;
  }

  simulate(): string {
    const category = getPlatformCategory(this.formData.platform as any);
    
    if (this.formData.tone === 'funny') {
      return this.createFunnyBio(category);
    }
    
    return this.createStandardBio(category);
  }

  private createFunnyBio(category: string): string {
    const templates = {
      professional: `${this.formData.profession} by day, ${this.getInterests()} enthusiast by night. Still figuring out adulting, but excellent at pretending I know what I'm doing.`,
      social: `${this.formData.profession || 'Professional overthinker'} 😎\n${this.getInterests()} addict\nWarning: May contain traces of sarcasm 🚨`,
      content: `Making ${this.formData.tone} content that nobody asked for but everyone needs\n${this.getInterests()}\nSubscribe for questionable life choices! 😂`,
      dating: `${this.formData.profession || 'Professional'} with a PhD in overthinking.\n${this.getInterests() ? `Love ${this.getInterests()} and ` : ''}terrible at writing bios apparently.\nSwipe right if you appreciate dad jokes.`
    };
    
    return this.applyCharacterLimit(templates[category] || templates.professional);
  }

  private createStandardBio(category: string): string {
    const templates = {
      professional: `${this.formData.profession} with a ${this.formData.tone} approach to work. Always looking for new opportunities to grow and make an impact.`,
      social: `${this.formData.profession || ''} ✨\n${this.getInterests()}\nLiving life with a ${this.formData.tone} vibe 📸`,
      content: `Creating ${this.formData.tone} content on ${this.formData.platform}\n${this.getInterests()}\nJoin the journey! 🎬`,
      dating: `${this.formData.profession || 'Creative'} with a ${this.formData.tone} personality.\n${this.getInterests() ? `Love ${this.getInterests()}. ` : ''}Looking for genuine connections.`
    };
    
    return this.applyCharacterLimit(templates[category] || templates.professional);
  }

  private getInterests(): string {
    if ('interests' in this.formData && this.formData.interests) {
      return this.formData.interests;
    }
    return 'new experiences';
  }

  private applyCharacterLimit(bio: string): string {
    if (this.formData.charLimit && this.formData.customCharCount > 0) {
      return bio.substring(0, this.formData.customCharCount);
    }
    return bio;
  }
}
