import _ from 'lodash';
import { useState } from 'react';
import { Input } from '../components/Input.component';
import { Popup, PopupCloseActionButton, PopupException, PopupSubmitActionButton } from '../components/Popup.component';
import { ICreateStreamInput } from '../entities/stream.entity';

export default function StreamPage() {
  const [createStreamPopupVisible, setCreateNewStreamPopupVisible] = useState(false);
  return (
    <div>
      <CreateNewStreamButton onClick={() => setCreateNewStreamPopupVisible(true)} />
      {createStreamPopupVisible && (
        <CreateNewStreamPopup onClose={() => setCreateNewStreamPopupVisible(false)} onNew={() => {}} />
      )}
    </div>
  );
}

function CreateNewStreamButton(props: { onClick: () => void }) {
  return (
    <div className='flex justify-end'>
      <button
        onClick={() => props.onClick()}
        className='text-indigo-600 font-medium border-2 border-indigo-600 p-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-150'
      >
        Create new stream
      </button>
    </div>
  );
}

function CreateNewStreamPopup(props: { onClose: () => void; onNew: () => void }) {
  const [exception, setException] = useState<string>('');
  const [submitting, setIsSubmitting] = useState(false);
  const [createStreamInput, setCreateStreamInput] = useState<ICreateStreamInput>({} as ICreateStreamInput);
  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
    } catch (error) {
      setException(_.get(error, 'message', 'Error occurred'));
      console.log('handleSubmit: ', error);
    }
  };
  const handleTitleChange = (title: string) => {
    setCreateStreamInput((prev) => ({ ...prev, title: title }));
  };
  const handleDescriptionChange = (desc: string) => {
    setCreateStreamInput((prev) => ({ ...prev, description: desc }));
  };

  const disableSubmit = () => {
    return !createStreamInput.title || !createStreamInput.description || submitting;
  };
  return (
    <Popup
      className='flex flex-col gap-1 w-[50%] h-auto'
      action={[
        <div key={0} className='flex w-full gap-1 justify-between'>
          {exception && <PopupException message={exception} />}
          <div className='flex gap-1 w-full justify-end'>
            <PopupCloseActionButton onClose={() => props.onClose()} />
            <PopupSubmitActionButton
              onSubmit={() => handleSubmit()}
              disabled={disableSubmit()}
              isSubmitting={submitting}
            />
          </div>
        </div>,
      ]}
      title='New stream'
    >
      <div className='w-full h-full overflow-y-auto p-4 pb-20 flex flex-col gap-2'>
        <Input
          name='title'
          placeholder='Enter the title of your stream'
          label='Title'
          value={createStreamInput.title}
          onChange={(e) => handleTitleChange(e as string)}
        />
        <Input
          name='description'
          placeholder='Enter the description of your stream'
          label='Description'
          value={createStreamInput.description}
          onChange={(e) => handleDescriptionChange(e as string)}
        />
      </div>
    </Popup>
  );
}
