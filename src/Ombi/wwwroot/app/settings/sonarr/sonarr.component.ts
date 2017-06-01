﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/takeUntil";

import { ISonarrSettings } from '../../interfaces/ISettings'
import { ISonarrProfile, ISonarrRootFolder } from '../../interfaces/ISonarr'
import { SettingsService } from '../../services/settings.service';
import { SonarrService } from '../../services/applications/sonarr.service';
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: 'ombi',
    moduleId: module.id,
    templateUrl: './sonarr.component.html',
})
export class SonarrComponent implements OnInit, OnDestroy {

    constructor(private settingsService: SettingsService, private sonarrService: SonarrService, private notificationService: NotificationService) { }

    settings: ISonarrSettings;

    qualities: ISonarrProfile[];
    rootFolders: ISonarrRootFolder[];

    selectedRootFolder: ISonarrRootFolder;
    selectedQuality: ISonarrProfile;

    profilesRunning: boolean;
    rootFoldersRunning: boolean;
    private subscriptions = new Subject<void>();

    ngOnInit(): void {

        this.settingsService.getSonarr()
            .takeUntil(this.subscriptions)
            .subscribe(x => {
                this.settings = x;
            });
    }


    getProfiles() {
        this.profilesRunning = true;
        this.sonarrService.getQualityProfiles(this.settings)
            .takeUntil(this.subscriptions)
            .subscribe(x => {
            this.qualities = x;

            this.profilesRunning = false;
            this.notificationService.success("Quality Profiles", "Successfully retrevied the Quality Profiles");
        });
    }

    getRootFolders() {
        this.rootFoldersRunning = true;
        this.sonarrService.getRootFolders(this.settings)
            .takeUntil(this.subscriptions)
            .subscribe(x => {
            this.rootFolders = x;

            this.rootFoldersRunning = false;
            this.notificationService.success("Settings Saved", "Successfully retrevied the Root Folders");
        });
    }

    test() {
        // TODO
    }

    save() {
        this.settingsService.saveSonarr(this.settings)
            .takeUntil(this.subscriptions)
            .subscribe(x => {
            if (x) {
                this.notificationService.success("Settings Saved", "Successfully saved Sonarr settings");
            } else {
                this.notificationService.success("Settings Saved", "There was an error when saving the Sonarr settings");
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.next();
        this.subscriptions.complete();
    }
}