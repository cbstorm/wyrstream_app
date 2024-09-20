import ERROR_CHARACTER from './error_character.png';
export function ErrorCharacter(
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  return <img src={ERROR_CHARACTER} alt='error_character' {...props} />;
}
