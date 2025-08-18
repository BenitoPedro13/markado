'use client';

import * as Badge from '@/components/align-ui/ui/badge';
import * as Button from '@/components/align-ui/ui/button';
import * as Dropdown from '@/components/align-ui/ui/dropdown';
import * as Drawer from '@/components/align-ui/ui/drawer';
import * as Divider from '@/components/align-ui/ui/divider';
import * as StatusBadge from '@/components/align-ui/ui/status-badge';
import * as Radio from '@/components/align-ui/ui/radio';
import {
  RiComputerLine,
  RiMapPinLine,
  RiTimeLine,
  RiMore2Fill,
  RiDeleteBinLine,
  RiUserAddLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiSendPlaneLine,
  RiSendPlane2Line
} from '@remixicon/react';
import * as Modal from '@/components/align-ui/ui/modal';
import * as Notification from '@/components/align-ui/ui/notification';
import {useState, useEffect} from 'react';
import Link from 'next/link';

type BookingProps = {
  uid: string;
  id: string;
  title: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  organizer: string;
  type: 'online' | 'presential';
  status: 'confirmed' | 'canceled';
  location?: string;
};

type Participant = {
  name: string;
  email: string;
};

type LocationType = 'online' | 'presential';
type OnlinePlatform = 'google-meet' | 'zoom' | 'teams';

export default function BookingListItem({
  uid,
  id,
  title,
  duration,
  startTime,
  endTime,
  organizer,
  type,
  status,
  location
}: BookingProps) {
  const updateBookingStatus = (id: string, status: string) => {};

  const deleteBooking = (id: string) => {};

  const updateBookingType = (
    id: string,
    type: LocationType,
    location: string
  ) => {};

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] =
    useState(false);
  const [participantEmails, setParticipantEmails] = useState(['']);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocationType, setSelectedLocationType] =
    useState<LocationType>(type);
  const [selectedPlatform, setSelectedPlatform] =
    useState<OnlinePlatform>('google-meet');
  const [address, setAddress] = useState(
    type === 'presential' ? location || '' : ''
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success'
  );
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState('');

  useEffect(() => {
    if (isLocationModalOpen) {
      setAddress(type === 'presential' ? location || '' : '');
    }
  }, [isLocationModalOpen, type, location]);

  const formatDate = (date: Date) => {
    const weekDays = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ];
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ];

    return {
      weekDay: weekDays[date.getDay()],
      date: `${date.getDate()} de ${months[date.getMonth()]}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}h`
    };
  };

  const startDate = formatDate(startTime);
  const endDate = formatDate(endTime);

  const handleCancel = (message?: string) => {
    updateBookingStatus(id, 'canceled');
    setIsCancelModalOpen(false);
    setCancelMessage('');
    setIsDrawerOpen(false);
  };

  const handleAddEmailInput = () => {
    setParticipantEmails([...participantEmails, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...participantEmails];
    newEmails[index] = value;
    setParticipantEmails(newEmails);
  };

  const handleAddParticipants = () => {
    const newParticipants = participantEmails
      .filter((email) => email.trim() !== '')
      .map((email) => ({
        name: email.split('@')[0],
        email: email
      }));

    setParticipants([...participants, ...newParticipants]);
    setIsAddParticipantsModalOpen(false);
    setParticipantEmails(['']);
  };

  const getParticipantsText = () => {
    if (participants.length === 0) return organizer;
    if (participants.length === 1)
      return `${organizer}, ${participants[0].name}`;
    return `${organizer} + ${participants.length} participantes`;
  };

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      {/* Componente Principal */}
      <div className="flex items-center justify-between p-4 hover:bg-bg-weak-50 transition-colors duration-200 bg-bg-white-0 rounded-lg shadow">
        <Drawer.Trigger asChild>
          <div className="flex gap-8 cursor-pointer w-full">
            <div className="w-[250px]">
              <h3 className="text-paragraph-lg font-medium text-text-strong-950">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge.Root
                  className="text-label-sm"
                  size="medium"
                  variant="lighter"
                  color={type === 'online' ? 'blue' : 'green'}
                >
                  <Badge.Icon
                    as={type === 'online' ? RiComputerLine : RiMapPinLine}
                  />
                  {type === 'online' ? 'Online' : 'Presencial'}
                </Badge.Root>
                <span className="text-sm text-text-sub-600">
                  {getParticipantsText()}
                </span>
              </div>
            </div>

            <div className="items-start">
              <div className="flex items-center gap-2 text-text-strong-950">
                <span className="font-medium">{startDate.date}</span>
                <span>{startDate.weekDay}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {status === 'confirmed' ? (
                  <StatusBadge.Root
                    className="text-label-sm"
                    status="completed"
                  >
                    <StatusBadge.Icon as={RiCheckboxCircleFill} />
                    Confirmado
                  </StatusBadge.Root>
                ) : (
                  <StatusBadge.Root className="text-label-sm" status="failed">
                    <StatusBadge.Icon as={RiCloseCircleFill} />
                    Cancelado
                  </StatusBadge.Root>
                )}
                <span className="text-paragraph-sm text-text-sub-600">
                  {startDate.time} até {endDate.time}
                </span>
              </div>
            </div>
          </div>
        </Drawer.Trigger>

        <div className="flex items-center gap-3">
          {status === 'confirmed' ? (
            <>
              {type === 'online' && (
                <Button.Root
                  variant="neutral"
                  mode="ghost"
                  size="small"
                  className="text-blue-400"
                >
                  <img src="/logos/Google Meet.svg" width={20} height={20} />
                  Entrar no Google Meet
                </Button.Root>
              )}
              <Button.Root asChild variant="neutral" mode="stroke" size="small">
                <Link href={`/reschedule/${uid}`}>
                  <Button.Icon as={RiTimeLine} />
                  Reagendar
                </Link>
              </Button.Root>
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button.Root variant="neutral" mode="stroke" size="small">
                    <Button.Icon as={RiMore2Fill} />
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align="end" className="w-fit">
                  <Dropdown.Item onClick={() => setIsLocationModalOpen(true)}>
                    <Dropdown.ItemIcon as={RiMapPinLine} />
                    Editar localização
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setIsAddParticipantsModalOpen(true)}
                  >
                    <Dropdown.ItemIcon as={RiUserAddLine} />
                    Adicionar participantes
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setIsRescheduleModalOpen(true)}>
                    <Dropdown.ItemIcon as={RiSendPlane2Line} />
                    Solicitar reagendamento
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setIsCancelModalOpen(true)}>
                    <Dropdown.ItemIcon as={RiDeleteBinLine} />
                    Cancelar agendamento
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </>
          ) : (
            <Button.Root variant="neutral" mode="stroke" size="small">
              <Button.Icon as={RiSendPlaneLine} />
              Solicitar reagendamento
            </Button.Root>
          )}
        </div>
      </div>

      {/* Conteudo do Drawer */}
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Detalhe do agendamento</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="space-y-4 h-full flex flex-col">
            <Divider.Root variant="solid-text">Data e Hora</Divider.Root>
            <div className="rounded-lg px-6 py-4 space-y-2">
              <div className="text-title-h4 text-text-strong-950">
                {startDate.time} até {endDate.time}
              </div>
              <div className="text-paragraph-md text-text-strong-950">
                {startDate.weekDay}, {startDate.date}
              </div>
            </div>
            <Divider.Root variant="solid-text">Convidado</Divider.Root>
            <div className="px-4 rounded-lg space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-success-lighter text-success-base rounded-full size-10 flex items-center justify-center text-heading-sm">
                  {organizer
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {organizer}
                  </div>
                  <div className="text-paragraph-sm text-text-sub-600">
                    {organizer.toLowerCase()}@gmail.com
                  </div>
                </div>
              </div>
            </div>
            {participants.length > 0 && (
              <>
                <Divider.Root variant="solid-text">
                  Participantes adicionais
                </Divider.Root>
                <div className="px-4 rounded-lg space-y-4">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-success-lighter text-success-base rounded-full size-10 flex items-center justify-center text-heading-sm">
                        {participant.email.split('@')[0][0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-paragraph-sm text-text-sub-600">
                          {participant.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Divider.Root variant="solid-text">Convidado</Divider.Root>
            <div className="px-4 rounded-lg space-y-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    ASSUNTO
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {title}
                  </div>
                </div>
                <Divider.Root />
                <div className="flex flex-col gap-2">
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    LOCAL
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    {type === 'online' ? (
                      <Button.Root variant="neutral" mode="ghost" size="small">
                        <img
                          src="/logos/Google Meet.svg"
                          width={20}
                          height={20}
                        />
                        Entrar com Google Meet
                      </Button.Root>
                    ) : (
                      location || 'Endereço não definido'
                    )}
                  </div>
                </div>
                <Divider.Root />
                <div className="flex flex-col gap-2">
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    DESCRIÇÃO
                  </div>
                  <div className="text-paragraph-md text-text-strong-950">
                    Um e-mail com detalhes sobre a reunião foi enviado para
                    todos os participantes.
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col justify-end ">
              <div className="bg-bg-weak-50 p-4 rounded-lg">
                <div className="text-subheading-xs text-text-soft-400 uppercase">
                  PRECISA ALTERAR?
                </div>
                <div className="mt-4 flex gap-3">
                  <Button.Root
                    variant="error"
                    mode="stroke"
                    size="medium"
                    className="w-full"
                    onClick={() => setIsCancelModalOpen(true)}
                  >
                    Cancelar
                  </Button.Root>
                  <Button.Root asChild variant="neutral" mode="stroke" size="medium" className="w-full">
                    <Link href={`/reschedule/${uid}`}>Reagendar</Link>
                  </Button.Root>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Body>
      </Drawer.Content>

      {/* Modal de cancelamento */}
      <Modal.Root open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <Modal.Content>
          <Modal.Header title="Motivo do cancelamento" />
          <Modal.Body>
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full min-h-24 rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950"
                placeholder="Por que você está cancelando?"
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
                maxLength={500}
              />
              <div className="flex items-center gap-2 text-text-sub-600 text-paragraph-xs">
                O motivo do cancelamento será compartilhado com os convidados
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="medium"
              className="w-full"
              onClick={() => handleCancel()}
            >
              Não importa
            </Button.Root>
            <Button.Root
              variant="error"
              mode="filled"
              size="medium"
              className="w-full"
              disabled={cancelMessage.trim().length === 0}
              onClick={() => handleCancel(cancelMessage)}
            >
              Cancelar este evento
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* Modal de adição de participantes */}
      <Modal.Root
        open={isAddParticipantsModalOpen}
        onOpenChange={setIsAddParticipantsModalOpen}
      >
        <Modal.Content>
          <Modal.Header title="Adicionar participantes" />
          <Modal.Body>
            <div className="flex flex-col gap-4">
              {participantEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    className="w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950"
                    placeholder="Digite o email do participante"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                </div>
              ))}
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                onClick={handleAddEmailInput}
              >
                <Button.Icon as={RiUserAddLine} />
                Adicionar mais
              </Button.Root>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="medium"
              className="w-full"
              onClick={() => setIsAddParticipantsModalOpen(false)}
            >
              Cancelar
            </Button.Root>
            <Button.Root
              variant="primary"
              mode="filled"
              size="medium"
              className="w-full"
              onClick={handleAddParticipants}
            >
              Adicionar participantes
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* Modal de edição de localização */}
      <Modal.Root
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
      >
        <Modal.Content>
          <Modal.Header title="Editar localização" />
          <Modal.Body>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="text-subheading-xs text-text-soft-400 uppercase">
                  TIPO DE REUNIÃO
                </div>
                <div className="flex flex-col gap-3">
                  <Radio.Group
                    value={selectedLocationType}
                    onValueChange={(value) =>
                      setSelectedLocationType(value as LocationType)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Radio.Item value="online" id="online" />
                      <label
                        htmlFor="online"
                        className="text-paragraph-md text-text-strong-950 cursor-pointer"
                      >
                        Online
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio.Item value="presential" id="presential" />
                      <label
                        htmlFor="presential"
                        className="text-paragraph-md text-text-strong-950 cursor-pointer"
                      >
                        Presencial
                      </label>
                    </div>
                  </Radio.Group>
                </div>
              </div>

              {selectedLocationType === 'online' ? (
                <div className="flex flex-col gap-4">
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    PLATAFORMA
                  </div>
                  <select
                    value={selectedPlatform}
                    onChange={(e) =>
                      setSelectedPlatform(e.target.value as OnlinePlatform)
                    }
                    className="w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-paragraph-sm text-text-strong-950 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950"
                  >
                    <option value="google-meet">Google Meet</option>
                    <option value="zoom" disabled>
                      Zoom (Em breve)
                    </option>
                    <option value="teams" disabled>
                      Microsoft Teams (Em breve)
                    </option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="text-subheading-xs text-text-soft-400 uppercase">
                    ENDEREÇO
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Digite o endereço da reunião"
                    className="w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950"
                  />
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="medium"
              className="w-full"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancelar
            </Button.Root>
            <Button.Root
              variant="primary"
              mode="filled"
              size="medium"
              className="w-full"
              onClick={() => {
                try {
                  const newLocation =
                    selectedLocationType === 'online' ? 'Google Meet' : address;
                  updateBookingType(id, selectedLocationType, newLocation);
                  setIsLocationModalOpen(false);
                  setNotificationType('success');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                } catch (error) {
                  setNotificationType('error');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }
              }}
            >
              Salvar alterações
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* Toast de notificação */}
      <Notification.Provider>
        <Notification.Viewport />
        {showNotification && (
          <Notification.Root
            variant="stroke"
            status={notificationType}
            title={notificationType === 'success' ? 'Sucesso!' : 'Erro!'}
            description={
              notificationType === 'success'
                ? isRescheduleModalOpen
                  ? 'Solicitação de reagendamento enviada com sucesso!'
                  : 'Localização atualizada com sucesso!'
                : 'Não foi possível atualizar a localização. Tente novamente.'
            }
            onOpenChange={setShowNotification}
          />
        )}
      </Notification.Provider>

      {/* Modal de reagendamento */}
      <Modal.Root
        open={isRescheduleModalOpen}
        onOpenChange={setIsRescheduleModalOpen}
      >
        <Modal.Content>
          <Modal.Header title="Solicitar reagendamento" />
          <Modal.Body>
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full min-h-24 rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-paragraph-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950"
                placeholder="Por que você precisa reagendar esta reunião?"
                value={rescheduleMessage}
                onChange={(e) => setRescheduleMessage(e.target.value)}
                maxLength={500}
              />
              <div className="flex items-center gap-2 text-text-sub-600 text-paragraph-xs">
                O motivo do reagendamento será compartilhado com os convidados
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="medium"
              className="w-full"
              onClick={() => setIsRescheduleModalOpen(false)}
            >
              Cancelar
            </Button.Root>
            <Button.Root
              variant="primary"
              mode="filled"
              size="medium"
              className="w-full"
              disabled={rescheduleMessage.trim().length === 0}
              onClick={() => {
                try {
                  // Aqui você pode adicionar a lógica para enviar a solicitação de reagendamento
                  setIsRescheduleModalOpen(false);
                  setRescheduleMessage('');
                  setNotificationType('success');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                } catch (error) {
                  setNotificationType('error');
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }
              }}
            >
              Enviar solicitação
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </Drawer.Root>
  );
}
