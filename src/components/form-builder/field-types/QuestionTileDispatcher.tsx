// Import other field-specific tiles as they're created
import { BaseQuestionTileProps, BaseQuestionTile } from "./shared";
import { MultipleChoice, Dropdown, YesNo, OpinionScale } from "./choice-fields";
import { Statement, Legal, FileUpload } from "./special-fields";
import {
  ShortText,
  Website,
  Email,
  PhoneNumber,
  LongText,
} from "./text-fields";
import { NumberRating } from "./rating-fields";
import { PageBreak, StartingPage } from "./structure-fields";

export const QuestionTileDispatcher: React.FC<BaseQuestionTileProps> = (
  props
) => {
  const { field } = props;

  // Route to field-specific component based on field type
  switch (field.type) {
    case "multipleChoice":
      return <MultipleChoice {...props} />;

    case "dropdown":
      return <Dropdown {...props} />; // Now uses dedicated dropdown component

    case "yesNo":
      return <YesNo {...props} />; // Dropdown uses same logic as MCQ

    case "opinionScale":
      return <OpinionScale {...props} />;

    case "shortText":
      return <ShortText {...props} />;

    case "email":
      return <Email {...props} />;

    case "website":
      return <Website {...props} />;

    case "phoneNumber":
      return <PhoneNumber {...props} />;

    case "longText":
      return <LongText {...props} />;

    case "numberRating":
      return <NumberRating {...props} />;

    case "statement":
      return <Statement {...props} />;

    case "legal":
      return <Legal {...props} />;

    case "fileUpload":
      return <FileUpload {...props} />;

    case "pageBreak":
      return <PageBreak {...props} />;

    case "startingPage":
      return <StartingPage {...props} />;

    // For now, fallback to BaseQuestionTile for unimplemented types
    default:
      return <BaseQuestionTile {...props} />;
  }
};
