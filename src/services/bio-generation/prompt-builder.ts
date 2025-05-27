
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
    const details = this.gatherAllDetails();
    return `Write a short and punchy professional bio in FIRST PERSON (using "I am", "I have", etc.). This person is a ${this.formData.profession}. 
Tone: ${this.formData.tone}. 
Include these details about them: ${details}. 
Avoid buzzwords like 'passionate', 'dedicated', 'expert'. 
No greetings or hashtags.
Write as if the person is introducing themselves directly.`;
  }

  private createSocialPrompt(): string {
    const details = this.gatherAllDetails();
    return `Write a creative and casual social media bio in FIRST PERSON. 
Tone: ${this.formData.tone}. 
Include these details: ${details}. 
Use short fragments or emojis if relevant. 
No intros or full sentences.
Write as if the person is describing themselves.`;
  }

  private createContentPrompt(): string {
    const details = this.gatherAllDetails();
    return `Write a creator-style bio for ${this.formData.platform} in FIRST PERSON. 
Tone: ${this.formData.tone}. 
Include these details: ${details}. 
Make it edgy, fun, or intriguing — whatever fits the tone.
Write as if the creator is introducing themselves.`;
  }

  private createDatingPrompt(): string {
    const details = this.gatherAllDetails();
    return `Write a dating profile bio in FIRST PERSON. 
Tone: ${this.formData.tone}. 
Include these personal details: ${details}. 
Avoid generic statements like 'I love long walks on the beach'. 
Be clever, human, and memorable.
Write as if the person is describing themselves to potential matches.`;
  }

  private gatherAllDetails(): string {
    const details: string[] = [];
    
    // Add interests if available
    if ('interests' in this.formData && this.formData.interests) {
      details.push(`Interests: ${this.formData.interests}`);
    }
    
    // Add fun facts if available
    if ('funFacts' in this.formData && this.formData.funFacts) {
      details.push(`Fun facts: ${this.formData.funFacts}`);
    }
    
    // Add experience if available
    if ('experience' in this.formData && this.formData.experience) {
      details.push(`Experience: ${this.formData.experience}`);
    }
    
    // Add achievements if available
    if ('achievements' in this.formData && this.formData.achievements) {
      details.push(`Achievements: ${this.formData.achievements}`);
    }
    
    // Add looking for (dating platforms)
    if ('lookingFor' in this.formData && this.formData.lookingFor) {
      details.push(`Looking for: ${this.formData.lookingFor}`);
    }
    
    // Add content type (content creator platforms)
    if ('content' in this.formData && this.formData.content) {
      details.push(`Content focus: ${this.formData.content}`);
    }
    
    // Add games (Twitch)
    if ('games' in this.formData && this.formData.games) {
      details.push(`Games: ${this.formData.games}`);
    }
    
    // Add schedule if available
    if ('schedule' in this.formData && this.formData.schedule) {
      details.push(`Schedule: ${this.formData.schedule}`);
    }
    
    return details.length > 0 ? details.join('. ') : 'their unique perspective and approach';
  }

  private addCharacterLimit(): string {
    if (this.formData.charLimit && this.formData.customCharCount > 0) {
      return ` IMPORTANT: Keep the bio under ${this.formData.customCharCount} characters total.`;
    }
    return '';
  }

  private addInstructions(): string {
    const baseInstructions = `

Important: 
- Write in FIRST PERSON using "I", "I'm", "I have", "I love", etc.
- Do not include any intros like "Hi, I'm..." or endings like "Thanks for reading"
- Keep it direct and authentic
- Avoid corporate fluff and generic phrases
- Make it feel human and genuine
- Generate exactly one bio, nothing else
- Never use third person references like "John is" or "She has"`;

    if (this.formData.charLimit && this.formData.customCharCount > 0) {
      return baseInstructions + `
- CRITICAL: The entire bio must be ${this.formData.customCharCount} characters or less`;
    }

    return baseInstructions;
  }
}
