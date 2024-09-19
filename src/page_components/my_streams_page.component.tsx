import _ from 'lodash';
import { useState } from 'react';
import { VideoPlaceholder } from '../assets/video_placeholder';
import { Input } from '../components/Input.component';
import { Popup, PopupCloseActionButton, PopupException, PopupSubmitActionButton } from '../components/Popup.component';
import { ICreateStreamInput, IStream } from '../entities/stream.entity';
import SignalIcon from '../icons/Signal.icon';
import SignalSlashIcon from '../icons/SignalSlash.icon';
import { APIBuilder } from '../services/base.service';
import streamService from '../services/stream.service';
import { Validator } from '../utils/validator';

export function CreateNewStreamButton(props: { onClick: () => void }) {
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

export function CreateNewStreamPopup(props: { onClose: () => void; onNew: (stream: IStream) => void }) {
  const [exception, setException] = useState<string>('');
  const [submitting, setIsSubmitting] = useState(false);
  const [createStreamInput, setCreateStreamInput] = useState<ICreateStreamInput>({} as ICreateStreamInput);
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const err = new Validator(createStreamInput).require('title').require('description').getFirstError();
      if (err) {
        throw err;
      }
      const apiBuilder = new APIBuilder<ICreateStreamInput>().setBody(createStreamInput);
      const stream = await streamService.CreateStream(apiBuilder);
      props.onNew(stream);
    } catch (error) {
      setException(_.get(error, 'message', 'Error occurred'));
      console.log('handleSubmit: ', error);
    }
    setIsSubmitting(false);
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
      <div className='overflow-y-auto p-4 pb-20 flex flex-col gap-2'>
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

export function GuidancePopup(props: { onClose: () => void; guidancePublishCommand: string }) {
  return (
    <Popup
      title='Guidance'
      className='flex flex-col gap-1 w-[50%] h-auto'
      action={[
        <div key={0} className='flex w-full gap-1 justify-between'>
          <div className='flex gap-1 w-full justify-end'>
            <PopupCloseActionButton onClose={() => props.onClose()} />
          </div>
        </div>,
      ]}
    >
      <div className='w-full h-full overflow-y-auto p-4 pb-20 flex flex-col gap-2'>
        <Input name='guidance' onChange={() => {}} value={props.guidancePublishCommand} placeholder='' disabled />
      </div>
    </Popup>
  );
}

export function MyStreamList(props: {
  isLoading: boolean;
  streams: IStream[];
  onItemClick: (stream: IStream) => void;
}) {
  return (
    <div className='grid grid-cols-4 gap-2'>
      {props.isLoading &&
        _.times(4, (i) => {
          return <MyStreamItemSkeleton key={i} />;
        })}
      {!props.streams.length && (
        <div className='flex justify-center col-span-full'>
          <span className='text-gray-600 font-medium'>You do not have any stream</span>
        </div>
      )}
      {props.streams.map((e, idx) => {
        return <MyStreamItem key={idx} stream={e} onClick={() => props.onItemClick(e)} />;
      })}
    </div>
  );
}

export function MyStreamItem(props: { stream: IStream; onClick: () => void }) {
  return (
    <div
      onClick={() => props.onClick()}
      className='fade-in shadow-lg overflow-hidden rounded-lg flex flex-col gap-2 bg-slate-50 cursor-pointer hover:shadow-xl transition-all duration-100'
    >
      <VideoPlaceholder className='w-full h-36 object-cover shadow-sm rounded-b-lg' />
      <div className='px-2 flex justify-between flex-col h-full'>
        <div className='h-full'>
          <h2 className='font-semibold text-gray-800'>{props.stream.title}</h2>
          <span className='text-sm text-gray-600'>{props.stream.description}</span>
        </div>
        <div className='flex justify-end py-2'>
          {props.stream.is_publishing && <SignalIcon className='text-emerald-600 w-6 h-6' />}
          {!props.stream.is_publishing && <SignalSlashIcon className='text-amber-600 w-6 h-6' />}
        </div>
      </div>
    </div>
  );
}

function MyStreamItemSkeleton() {
  return <div className='h-60 rounded-lg bg-slate-300 animate-pulse'></div>;
}
