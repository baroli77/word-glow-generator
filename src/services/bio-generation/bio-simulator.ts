
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
    const funFacts = this.getFunFacts();
    const interests = this.getInterests();
    
    const templates = {
      professional: `${this.formData.profession} by day, ${interests} enthusiast by night. ${funFacts ? funFacts + '. ' : ''}Still figuring out adulting, but excellent at pretending I know what I'm doing.`,
      social: `${this.formData.profession || 'Professional overthinker'} 😎\n${interests} addict\n${funFacts ? funFacts + '\n' : ''}Warning: May contain traces of sarcasm 🚨`,
      content: `Making ${this.formData.tone} content that nobody asked for but everyone needs\n${interests}\n${funFacts ? funFacts + '\n' : ''}Subscribe for questionable life choices! 😂`,
      dating: `${this.formData.profession || 'Professional'} with a PhD in overthinking.\n${interests ? `Love ${interests} and ` : ''}${funFacts ? funFacts + '. ' : ''}terrible at writing bios apparently.\nSwipe right if you appreciate dad jokes.`
    };
    
    return this.applyCharacterLimit(templates[category] || templates.professional);
  }

  private createStandardBio(category: string): string {
    const funFacts = this.getFunFacts();
    const interests = this.getInterests();
    
    const templates = {
      professional: `${this.formData.profession} with a ${this.formData.tone} approach to work. ${funFacts ? funFacts + '. ' : ''}Always looking for new opportunities to grow and make an impact.`,
      social: `${this.formData.profession || ''} ✨\n${interests}\n${funFacts ? funFacts + '\n' : ''}Living life with a ${this.formData.tone} vibe 📸`,
      content: `Creating ${this.formData.tone} content on ${this.formData.platform}\n${interests}\n${funFacts ? funFacts + '\n' : ''}Join the journey! 🎬`,
      dating: `${this.formData.profession || 'Creative'} with a ${this.formData.tone} personality.\n${interests ? `Love ${interests}. ` : ''}${funFacts ? funFacts + '. ' : ''}Looking for genuine connections.`
    };
    
    return this.applyCharacterLimit(templates[category] || templates.professional);
  }

  private getFunFacts(): string {
    if ('funFacts' in this.formData && this.formData.funFacts) {
      return this.formData.funFacts;
    }
    return '';
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
