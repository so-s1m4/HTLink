import { Component, effect, inject, OnInit } from '@angular/core';
import { Block } from '@shared/ui/block/block';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TagType } from '@core/types/types.constans';
import { ProfileService } from '@core/services/profile.service';
import { ImgPipe } from '@shared/utils/img.pipe';
import { Tag } from '@shared/ui/tag/tag';
import { MainService } from '@core/services/main.service';
import { NotificationService } from '@core/services/notification.service';
import { AppSelectComponent } from '@shared/ui/select/select';
import { NgIcon } from '@ng-icons/core';
import { Icons } from '@core/types/icons.enum';

@Component({
  selector: 'app-edit',
  imports: [Block, RouterLink, ReactiveFormsModule, Tag, AppSelectComponent, NgIcon, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  Icons = Icons;

  constructor(public profileService: ProfileService) {
    effect(() => {
      const me = this.profileService.me$();
      if (!me) return;

      this.profileForm.patchValue({
        ...me,
        photo_path: me.photo_path ? ImgPipe.transform(me.photo_path) : null,
      });
    });
  }

  private mainService = inject(MainService);
  private notificationService = inject(NotificationService);

  profileForm = new FormGroup({
    photo_path: new FormControl<string | null>(null),
    description: new FormControl('', [Validators.maxLength(300)]),
    github_link: new FormControl('', [Validators.pattern('https://github.com/.+')]),
    linkedin_link: new FormControl('', [Validators.pattern('https://linkedin.com/.+')]),
    banner_link: new FormControl('', [Validators.maxLength(100)]),
    class: new FormControl('', [Validators.pattern(/^[1-5][A-Z]{1}[A-Z]{2,4}$/i)]),
    department: new FormControl<string | null>(null),
    skills: new FormControl<TagType[]>([]),
  });
  
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.minLength(6)])
  });
  
  skills: TagType[] = [];
  isPending = false;
  showPasswordSection = false;
  departments = ['IF', 'WI', 'MB', 'EL', 'ETI'];

  async ngOnInit(): Promise<void> {
    this.skills = (await this.mainService.getSkills()) ?? [];
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.profileForm.patchValue({ photo_path: URL.createObjectURL(file) });
    }
  }
  async submitEdit() {
    if (this.profileForm.valid) {
      this.isPending = true;
      await this.profileService.updateProfile(this.profileForm.value);
      this.isPending = false;
    }
  }

  async changePassword() {
    if (!this.passwordForm.valid) {
      this.notificationService.addNotification('Please enter a valid password (min 6 characters)', 4);
      return;
    }
    
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      this.notificationService.addNotification('Passwords do not match', 4);
      return;
    }
    
    this.isPending = true;
    try {
      await this.profileService.updateProfile({ password });
      this.notificationService.addNotification('Password changed successfully', 2);
      this.passwordForm.reset();
      this.showPasswordSection = false;
    } catch (error) {
      this.notificationService.addNotification('Failed to change password', 4);
    } finally {
      this.isPending = false;
    }
  }

  removeSkill(skill: TagType) {
    let newSkills: TagType[] = this.profileForm.get('skills')?.value || [];
    this.profileForm.patchValue({ skills: newSkills.filter((s: TagType) => s.id !== skill.id) });
  }

  addSkill($event: {
    target: {
      value: string | number | null;
    };
  }) {
    const value = $event.target.value;

    const skill = this.skills.find((s) => s.id === value);
    if (skill) {
      const currentSkills: TagType[] = this.profileForm.get('skills')?.value || [];
      if (!currentSkills.find((s) => s.id === skill.id)) {
        this.profileForm.patchValue({ skills: [...currentSkills, skill] });
      }
    }
  }

  toOptions(skills: TagType[]) {
    return skills.map((i) => ({ label: i.name, value: i.id }));
  }
}
