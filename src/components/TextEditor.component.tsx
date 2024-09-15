import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  toolbarPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export default function TextEditor(props: {
  className?: string;
  placeholder?: string;
  markdown: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <ListsToggle options={['bullet']} />
            </>
          ),
        }),
      ]}
      {...props}
      onChange={(v) => props.onValueChange(v)}
    />
  );
}
