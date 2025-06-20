import { TextShimmer } from '@/components/ui/text-shimmer';

export function TextShimmerBasic() {
  return (
    <TextShimmer className='font-mono text-sm' duration={1}>
      Generating code...
    </TextShimmer>
  );
}

export function TextShimmerColor() {
  return (
    <TextShimmer
      duration={1.2}
      className='text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]'
    >
      Hi, how are you?
    </TextShimmer>
  );
} 