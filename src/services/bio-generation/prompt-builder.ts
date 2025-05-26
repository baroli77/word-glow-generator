
import { BioFormData, PlatformCategory, ToneType } from '../../components/bio-generator/types';
import { getPlatformCategory } from '../../components/bio-generator/config/platform-config';

export class PromptBuilder {
  private formData: BioFormData;
  private category: PlatformCategory;

  constructor(formData: BioFormData) {
    this.formData = formData;
    this.category = getPlatformCategory(formData.platform as any);
  }

  build(): string {
    const basePrompt = this.createBasePrompt();
    const characterLimit = this.addCharacterLimit();
    const instructions = this.addInstructions();
    
    return `${basePrompt}${characterLimit}${instructions}`;
  }

  private createBasePrompt(): string {
    const prompts = {
      professional: this.createProfessionalPrompt(),
      social: this.createSocialPrompt(),
      content: this.createContentPrompt(),
      dating: this.createDatingPrompt()
    };

    return prompts[this.category];
  }

  private createProfessionalPrompt(): string {
    const quirk = this.extractQuirk();
    return `Write a short and punchy professional bio. This person is a ${this.formData.profession}. 
Tone: ${this.formData.tone}. 
Include something unique about them: ${quirk}. 
Avoid buzzwords like 'passionate', 'dedicated', 'expert'. 
No greetings or hashtags.`;
  }

  private createSocialPrompt(): string {
    const quirk = this.extractQuirk();
    return `Write a creative and casual social media bio. 
Tone: ${this.formData.tone}. 
Include this detail: ${quirk}. 
Use short fragments or emojis if relevant. 
No intros or full sentences.`;
  }

  private createContentPrompt(): string {
    const quirk = this.extractQuirk();
    return `Write a creator-style bio for ${this.formData.platform}. 
Tone: ${this.formData.tone}. 
Include this detail: ${quirk}. 
Make it edgy, fun, or intriguing — whatever fits the tone.`;
  }

  private createDatingPrompt(): string {
    const quirk = this.extractQuirk();
    return `Write a dating profile bio. 
Tone: ${this.formData.tone}. 
Include this personal detail or quirk: ${quirk}. 
Avoid generic statements like 'I love long walks on the beach'. 
Be clever, human, and memorable.`;
  }

  private extractQuirk(): string {
    // Prioritize fun facts if available
    if ('funFacts' in this.formData && this.formData.funFacts) {
      return this.formData.funFacts;
    }
    if ('interests' in this.formData && this.formData.interests) {
      return this.formData.interests;
    }
    if ('achievements' in this.formData && this.formData.achievements) {
      return this.formData.achievements;
    }
    if ('experience' in this.formData && this.formData.experience) {
      return this.formData.experience;
    }
    
    return 'their unique perspective and approach';
  }

  private addCharacterLimit(): string {
    if (this.formData.charLimit && this.formData.customCharCount > 0) {
      return ` Max ${this.formData.customCharCount} characters.`;
    }
    return '';
  }

  private addInstructions(): string {
    return `

Important: 
- Do not include any intros like "Hi, I'm..." or endings like "Thanks for reading"
- Keep it direct and authentic
- Avoid corporate fluff and generic phrases
- Make it feel human and genuine
- Generate exactly one bio, nothing else`;
  }
}
