import { FormData } from '@/types/form';

export function createRelocationPrompt(formData: FormData): string {
  const {
    destinationCountries,
    passportCountries,
    familySize,
    numberOfKids,
    kids,
    professions,
    partnerProfessions,
    additionalInfo,
  } = formData;

  // Helper function to format arrays into readable strings
  const formatList = (items: Array<{ name: string }>) => 
    items.map(item => item.name).join(', ');

  // Format family composition
  const getFamilyComposition = () => {
    switch (familySize) {
      case 'just-me':
        return 'relocating alone';
      case 'me-and-partner':
        return 'relocating with a partner';
      case 'me-partner-and-kids':
        return `relocating with a partner and ${numberOfKids} ${numberOfKids === 1 ? 'child' : 'children'} (ages: ${kids.map(k => k.age).join(', ')})`;
      default:
        return '';
    }
  };

  // Build the prompt
  const prompt = `
Create a detailed relocation plan for the following scenario:

PROFILE:
- Citizenship: ${formatList(passportCountries)}
- Desired Destinations: ${formatList(destinationCountries)}
- Family Status: ${getFamilyComposition()}
- Professional Background: ${formatList(professions)}
${familySize !== 'just-me' ? `- Partner's Professional Background: ${formatList(partnerProfessions)}` : ''}

Additional Context:
${additionalInfo}

Please provide a comprehensive relocation plan that includes:
1. Visa Options: Analyze and recommend the most suitable visa pathways based on the profile.
2. Employment Prospects: Evaluate job market opportunities for the given professional background.
3. Location Analysis: Suggest specific cities/regions within the chosen countries that best match the profile.
4. Timeline & Steps: Outline a realistic timeline for the relocation process.
5. Cost Estimation: Provide a rough estimate of relocation costs.
6. Family Considerations: ${familySize !== 'just-me' ? 'Include partner employment opportunities and family-specific requirements.' : 'Not applicable (relocating alone).'}
7. Legal Requirements: List necessary documentation and legal procedures.
8. Practical Tips: Offer advice on housing, banking, healthcare, and other essential services.

Focus on providing actionable insights and specific recommendations rather than general information.
`;

  return prompt.trim();
}

// Example usage:
/*
const formData = {
  destinationCountries: [{ name: 'United States' }, { name: 'Canada' }],
  passportCountries: [{ name: 'United Kingdom' }],
  familySize: 'me-partner-and-kids',
  numberOfKids: 2,
  kids: [{ age: 5 }, { age: 8 }],
  professions: [{ name: 'Software Engineer' }],
  partnerProfessions: [{ name: 'Teacher' }],
  additionalInfo: 'Looking for tech hubs with good schools'
};

const prompt = createRelocationPrompt(formData);
*/
