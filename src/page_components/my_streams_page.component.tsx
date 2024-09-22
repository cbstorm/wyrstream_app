import _ from 'lodash';
import moment from 'moment-timezone';
import { useState } from 'react';
import { CheckBox, Input } from '../components/Input.component';
import { Popup, PopupCloseActionButton, PopupException, PopupSubmitActionButton } from '../components/Popup.component';
import { VideoPlayer, VideoTypes } from '../components/Video.component';
import ThumbnailComponent from '../components/VideoThumbnail.component';
import { ICreateStreamInput, IStream } from '../entities/stream.entity';
import { IStreamLog } from '../entities/stream_log.entity';
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
      const err = new Validator(createStreamInput)
        .require('title')
        .minLength('title', 6)
        .maxLength('title', 50)
        .require('description')
        .minLength('description', 6)
        .maxLength('description', 255)
        .getFirstError();
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
  const handleEnableRecordChange = (enable: boolean) => {
    setCreateStreamInput((prev) => ({ ...prev, enable_record: enable }));
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
        <CheckBox
          name='enable_record'
          label='Recording'
          title='Enable Recording'
          description='Allow this stream to be recorded for future playback. When enabled, the stream will be saved and can be accessed later for on-demand viewing.'
          checked={createStreamInput.enable_record}
          onChange={(v) => handleEnableRecordChange(v)}
        />
      </div>
    </Popup>
  );
}

export function StreamInfoPopup(props: { onClose: () => void; stream: IStream }) {
  return (
    <Popup
      title='Stream Information'
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
        {/* <Input label="URL" value={props.stream.} /> */}
        <Input label='FFmpeg guidance command' name='guidance' onChange={() => {}} value={props.stream.guidance_command} placeholder='' disabled />
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
      <ThumbnailComponent thumbnail_url={props.stream.thumbnail_url} />
      <div className='px-2 flex justify-between flex-col h-full'>
        <div className='h-full'>
          <h2 className='font-semibold text-gray-800'>{props.stream.title}</h2>
          <span className='text-sm text-gray-600'>{props.stream.description}</span>
        </div>
        <div className='flex justify-end py-2'>
          {props.stream.is_publishing && <SignalIcon className='text-emerald-600 w-6 h-6 blink' />}
          {!props.stream.is_publishing && <SignalSlashIcon className='text-amber-600 w-6 h-6' />}
        </div>
      </div>
    </div>
  );
}

function MyStreamItemSkeleton() {
  return <div className='h-60 rounded-lg bg-slate-300 animate-pulse'></div>;
}

export function MyStreamViewPopup(props: { stream: IStream; onClose: () => void }) {
  return (
    <Popup
      title={props.stream.title}
      className='flex flex-col gap-1 w-[80%] h-[80%]'
      action={[
        <div key={0} className='flex w-full gap-1 justify-between'>
          <div className='flex gap-1 w-full justify-end'>
            <PopupCloseActionButton onClose={() => props.onClose()} />
          </div>
        </div>,
      ]}
    >
      <div className='w-full h-full p-4 flex flex-col gap-2'>
        <VideoPlayer
          src={props.stream.hls_url}
          type={VideoTypes.X_MPEGURL}
          autoplay
          className='w-full h-full object-cover rounded-lg'
        />
        <StreamLogs logs={props.stream.stream_logs} />
      </div>
    </Popup>
  );
}

function StreamLogs(props: { logs: IStreamLog[] }) {
  return (
    <div className='flex flex-col gap-2 h-[20%] bg-slate-200 p-2 rounded-lg overflow-y-auto'>
      <h2 className='font-bold text-lg text-gray-800'>Logs:</h2>
      <div className='flex flex-col overflow-y-auto'>
        {props.logs.map((e, idx) => {
          return (
            <div key={idx} className='flex gap-1 text-sm'>
              <span className='font-bold'>{moment(e.createdAt).format('HH:mm:ss DD/MM/YYYY')}</span>
              <span className='font-bold'>{'>'}</span>
              <span className=''>{e.log}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
