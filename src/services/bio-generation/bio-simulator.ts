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
    const experience = this.getExperience();
    const achievements = this.getAchievements();
    
    const templates = {
      professional: `I'm a ${this.formData.profession || 'professional human'} by day, ${interests} enthusiast by night. ${experience ? 'I have ' + experience + '. ' : ''}${achievements ? 'I ' + achievements + '. ' : ''}${funFacts ? funFacts + '. ' : ''}Still figuring out adulting, but excellent at pretending I know what I'm doing.`,
      social: `${this.formData.profession || 'Professional overthinker'} 😎\n${interests} addict\n${funFacts ? funFacts + '\n' : ''}${achievements ? 'I ' + achievements + '\n' : ''}Warning: May contain traces of sarcasm 🚨`,
      content: `I make ${this.formData.tone} content that nobody asked for but everyone needs\n${interests}\n${funFacts ? funFacts + '\n' : ''}${experience ? 'I have ' + experience + '\n' : ''}Subscribe for my questionable life choices! 😂`,
      dating: `I'm a ${this.formData.profession || 'professional overthinker'} with a PhD in overthinking.\n${interests ? `I love ${interests}. ` : ''}${funFacts ? funFacts + '. ' : ''}${this.getLookingFor() ? `Looking for ${this.getLookingFor().toLowerCase()}. ` : ''}Terrible at writing bios apparently.\nSwipe right if you appreciate dad jokes.`
    };
    
    return this.applyCharacterLimit(templates[category] || templates.professional);
  }

  private createStandardBio(category: string): string {
    const funFacts = this.getFunFacts();
    const interests = this.getInterests();
    const experience = this.getExperience();
    const achievements = this.getAchievements();
    
    const templates = {
      professional: `I'm a ${this.formData.profession || 'professional'} with a ${this.formData.tone} approach to work. ${experience ? 'I have ' + experience + '. ' : ''}${achievements ? 'I ' + achievements + '. ' : ''}${interests ? `I'm passionate about ${interests}. ` : ''}${funFacts ? funFacts + '. ' : ''}Always looking for new opportunities to grow and make an impact.`,
      social: `${this.formData.profession || ''} ✨\n${interests ? interests + '\n' : ''}${funFacts ? funFacts + '\n' : ''}${achievements ? 'I ' + achievements + '\n' : ''}Living life with a ${this.formData.tone} vibe 📸`,
      content: `I create ${this.formData.tone} content on ${this.formData.platform}\n${this.getContent() || interests}\n${experience ? 'I have ' + experience + '\n' : ''}${funFacts ? funFacts + '\n' : ''}Join my journey! 🎬`,
      dating: `I'm a ${this.formData.profession || 'creative soul'} with a ${this.formData.tone} personality.\n${interests ? `I love ${interests}. ` : ''}${funFacts ? funFacts + '. ' : ''}${this.getLookingFor() ? `Looking for ${this.getLookingFor().toLowerCase()}. ` : 'Looking for genuine connections.'}`
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

  private getExperience(): string {
    if ('experience' in this.formData && this.formData.experience) {
      return this.formData.experience;
    }
    return '';
  }

  private getAchievements(): string {
    if ('achievements' in this.formData && this.formData.achievements) {
      return this.formData.achievements;
    }
    return '';
  }

  private getLookingFor(): string {
    if ('lookingFor' in this.formData && this.formData.lookingFor) {
      return this.formData.lookingFor;
    }
    return '';
  }

  private getContent(): string {
    if ('content' in this.formData && this.formData.content) {
      return this.formData.content;
    }
    return '';
  }

  private applyCharacterLimit(bio: string): string {
    if (this.formData.charLimit && this.formData.customCharCount > 0) {
      return bio.substring(0, this.formData.customCharCount);
    }
    return bio;
  }
}
