/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { Metadata } from 'grpc';
import { dialog } from '@dlghq/dialog-api';
import Service, { Config } from './Service';

class Groups extends Service<any> {
  constructor(config: Config) {
    super(dialog.Groups, config);
  }

  loadMembers(
    request: dialog.RequestLoadMembers,
    metadata?: Metadata,
  ): Promise<dialog.ResponseLoadMembers> {
    return this.service.loadMembersAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  createGroup(
    request: dialog.RequestCreateGroup,
    metadata?: Metadata,
  ): Promise<dialog.ResponseCreateGroup> {
    return this.service.createGroupAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  editGroupTitle(
    request: dialog.RequestEditGroupTitle,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeqDateMid> {
    return this.service.editGroupTitleAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  editGroupAbout(
    request: dialog.RequestEditGroupAbout,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeqDate> {
    return this.service.editGroupAboutAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  inviteUser(
    request: dialog.RequestInviteUser,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeqDateMid> {
    return this.service.inviteUserAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  leaveGroup(
    request: dialog.RequestLeaveGroup,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeqDateMid> {
    return this.service.leaveGroupAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  kickUser(
    request: dialog.RequestKickUser,
    metadata?: Metadata,
  ): Promise<dialog.ResponseSeqDateMid> {
    return this.service.kickUserAsync(request, metadata, this.getCallOptions());
  }

  getGroupInviteUrl(
    request: dialog.RequestGetGroupInviteUrl,
    metadata?: Metadata,
  ): Promise<dialog.ResponseInviteUrl> {
    return this.service.getGroupInviteUrlAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }

  joinGroup(
    request: dialog.RequestJoinGroup,
    metadata?: Metadata,
  ): Promise<dialog.ResponseJoinGroup> {
    return this.service.joinGroupAsync(
      request,
      metadata,
      this.getCallOptions(),
    );
  }
}

export default Groups;
