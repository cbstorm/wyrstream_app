import _ from 'lodash';
import moment from 'moment-timezone';
import { useState } from 'react';
import { CheckBox, Input } from '../components/Input.component';
import { Popup, PopupCloseActionButton, PopupException, PopupSubmitActionButton } from '../components/Popup.component';
import { VideoPlayer, VideoTypes } from '../components/Video.component';
import ThumbnailComponent from '../components/VideoThumbnail.component';
import { ICreateStreamInput, IStream, IUpdateStreamInput } from '../entities/stream.entity';
import { IStreamLog } from '../entities/stream_log.entity';
import { ArchiveBoxX } from '../icons/ArchiveBox.icon';
import CheckIcon from '../icons/Check.icon';
import CloseIcon from '../icons/Close.icon';
import PencilSquareIcon from '../icons/PencilSquare.icon';
import PlayCircleIcon from '../icons/PlayCircle.icon';
import { RecordIcon, RecordSlash } from '../icons/Record.icon';
import { SignalIcon, SignalSlashIcon } from '../icons/Signal.icon';
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

export function StreamInfoPopup(props: {
  onClose: () => void;
  onConvertVOD: () => void;
  closeStream: () => void;
  stream: IStream;
}) {
  const [edit, setEdit] = useState(false);
  const [updateStreamInput, setUpdateStreamInput] = useState<IUpdateStreamInput>({} as IUpdateStreamInput);
  const handleEdit = (isEdit: boolean) => {
    if (!edit && isEdit) {
      setEdit(true);
      return;
    }
    if (edit && !isEdit) {
      setUpdateStreamInput({} as IUpdateStreamInput);
      setEdit(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setUpdateStreamInput((prev) => ({ ...prev, title }));
  };
  const handleDescriptionChange = (description: string) => {
    setUpdateStreamInput((prev) => ({ ...prev, description }));
  };
  const handleEnableRecordingChange = (enableRecord: boolean) => {
    setUpdateStreamInput((prev) => ({ ...prev, enable_record: enableRecord }));
  };
  const handleSubmit = async () => {
    try {
      const body: IUpdateStreamInput = {
        title: updateStreamInput.title || props.stream.title,
        description: updateStreamInput.description || props.stream.description,
        enable_record:
          updateStreamInput.enable_record !== undefined ? updateStreamInput.enable_record : props.stream.enable_record,
      };
      const apiBuidler = new APIBuilder<IUpdateStreamInput>().addParam(props.stream._id).setBody(body);
      await streamService.UpdateOneStream(apiBuidler);
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Popup
      title='Stream Information'
      className='flex flex-col gap-1 w-[50%] h-auto'
      action={[
        <div key={0} className='flex w-full gap-1 justify-between'>
          <div className='flex gap-1 w-full justify-end'>
            {/* Convert VOD button */}
            {/* Stream is Enable Recording and Stream is ready for VOD */}
            {props.stream.stopped_at && (
              <button
                onClick={() => props.closeStream()}
                className='flex gap-1 items-center bg-white border border-rose-800 rounded-lg px-3 py-2 text-rose-800 text-sm font-semibold hover:bg-cyan-50 hover:text-opacity-60 transition-all duration-100'
              >
                <ArchiveBoxX />
                <span>Close the stream</span>
              </button>
            )}
            {/* Close stream button */}
            {props.stream.enable_record && props.stream.ready_for_vod && (
              <button
                onClick={() => props.onConvertVOD()}
                className='flex gap-1 items-center bg-white border border-cyan-800 rounded-lg px-3 py-2 text-cyan-800 text-sm font-semibold hover:bg-cyan-50 hover:text-opacity-60 transition-all duration-100'
              >
                <PlayCircleIcon />
                <span>Convert to VOD and close the stream</span>
              </button>
            )}
            {/* Close popup Button */}
            <PopupCloseActionButton onClose={() => props.onClose()} />
          </div>
        </div>,
      ]}
    >
      <div className='flex justify-end'>
        {/* Edit button */}
        {!edit && (
          <button
            className='p-1 flex items-center gap-1 border-orange-400 border rounded-lg hover:'
            onClick={() => handleEdit(true)}
          >
            <PencilSquareIcon className='text-orange-400 w-6 h-6' />
            <span className='text-sm text-orange-400 font-medium'>Edit</span>
          </button>
        )}
        {edit && (
          <div className='flex gap-1'>
            <button
              className='p-1 flex items-center gap-1 border-teal-600 border rounded-lg'
              onClick={() => handleSubmit()}
            >
              <CheckIcon className='text-teal-600 w-6 h-6' />
              <span className='text-sm text-teal-600 font-medium'>Ok</span>
            </button>
            <button
              className='p-1 flex items-center gap-1 border-amber-600 border rounded-lg'
              onClick={() => handleEdit(false)}
            >
              <CloseIcon className='text-amber-600 w-6 h-6' />
              <span className='text-sm text-amber-600 font-medium'>Cancel</span>
            </button>
          </div>
        )}
      </div>
      <div className='w-full h-full overflow-y-auto p-4 pb-20 flex flex-col gap-2'>
        <Input
          label='Title'
          value={updateStreamInput.title || props.stream.title}
          name='title'
          onChange={(v) => handleTitleChange(v as string)}
          placeholder='Title'
          disabled={!edit}
        />
        <Input
          label='Description'
          value={updateStreamInput.description || props.stream.description}
          name='description'
          onChange={(v) => handleDescriptionChange(v as string)}
          placeholder='Description'
          disabled={!edit}
        />
        <CheckBox
          name='enable_record'
          label='Recording'
          title='Enable Recording'
          description='Allow this stream to be recorded for future playback. When enabled, the stream will be saved and can be accessed later for on-demand viewing.'
          checked={
            updateStreamInput.enable_record !== undefined ? updateStreamInput.enable_record : props.stream.enable_record
          }
          onChange={(v) => handleEnableRecordingChange(v)}
          disabled={!edit}
        />
        <Input
          label='Server'
          value={props.stream.stream_server_url}
          name='stream_server_url'
          onChange={() => {}}
          placeholder=''
          disabled
        />
        <Input
          label='Stream ID'
          value={props.stream.stream_id}
          name='stream_id'
          onChange={() => {}}
          placeholder=''
          disabled
        />
        <Input
          label='Stream URL'
          value={props.stream.stream_url}
          name='stream_url'
          onChange={() => {}}
          placeholder=''
          disabled
        />
        <Input
          label='FFmpeg guidance command'
          name='guidance_command'
          onChange={() => {}}
          value={props.stream.guidance_command}
          placeholder=''
          disabled
        />
      </div>
    </Popup>
  );
}

export function ConfirmActionPopup(props: {
  onConfirm: () => void;
  onCancel: () => void;
  type: 'conv-vod' | 'close-stream';
}) {
  return (
    <Popup title={props.type === 'conv-vod' ? 'Convert Stream to Video on Demand' : 'Close Video Stream'}>
      <div className='py-4'>
        {props.type === 'conv-vod' && (
          <span>
            Are you sure you want to convert this live stream to a Video on Demand? This action will save the current
            stream as a video that can be watched later.
          </span>
        )}
        {props.type === 'close-stream' && (
          <span>
            Are you sure you want to close this live stream? This action will stop the stream and it will no longer be
            available for viewers.
          </span>
        )}
      </div>
      <div className='flex gap-1 items-center justify-end'>
        <button
          onClick={() => props.onCancel()}
          className='bg-white border border-rose-800 rounded-lg px-3 py-2 text-rose-800 text-sm font-semibold hover:bg-rose-50 hover:text-opacity-60 transition-all duration-100'
        >
          Cancel
        </button>
        <button
          onClick={() => props.onConfirm()}
          className='bg-white border border-cyan-800 rounded-lg px-3 py-2 text-cyan-800 text-sm font-semibold hover:bg-cyan-50 hover:text-opacity-60 transition-all duration-100'
        >
          OK
        </button>
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
    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4'>
      {props.streams.map((e, idx) => {
        return <MyStreamItem key={idx} stream={e} onClick={() => props.onItemClick(e)} />;
      })}
      {props.isLoading &&
        _.times(4, (i) => {
          return <MyStreamItemSkeleton key={i} />;
        })}
      {!props.isLoading && !props.streams.length && (
        <div className='flex justify-center col-span-full'>
          <span className='text-gray-600 font-medium'>
            🎥 No video streams here yet! Upload your first video streams to get started and share it with the world!
          </span>
        </div>
      )}
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
      <div className='px-2 flex justify-between flex-col'>
        <div className='h-auto'>
          <div className='flex justify-end'>
            <span className='font-semibold text-xs text-indigo-400'>#{props.stream.stream_id}</span>
          </div>
          <h2 className='font-semibold text-gray-800'>{props.stream.title}</h2>
          <div className='h-auto truncate'>
            <span className='text-sm text-gray-600'>{props.stream.description}</span>
          </div>
        </div>
        <div className='flex justify-end gap-2 py-2'>
          {props.stream.enable_record && (
            <RecordIcon className={'w-6 h-6 text-fuchsia-800 ' + (props.stream.is_publishing ? 'blink' : '')} />
          )}
          {!props.stream.enable_record && <RecordSlash className='text-fuchsia-800 w-6 h-6' />}
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
          controls
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
