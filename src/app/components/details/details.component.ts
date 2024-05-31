import { Component,OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../service/student.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Gender } from '../../models/gender.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  showDialog: boolean = false;
  genderEnum = Gender
  selectedGender: Gender = Gender.Male;

@Input() currentStudent: Student ={
   date: new Date(),
   studentName: '',
   studentNrc: '',
   age: 0,
   dateOfBirth: new Date(),
   fatherName: '',
   gender: Gender.Male ,
   township: '',
   address: '',
   photo: '',
}

  localdomain =  'http://localhost:8080';

  faArrowLeft = faArrowLeft;
  pencil = faPencil;

  // student: Student = {};
  student: Student | undefined;

  constructor(private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
   private dialog: MatDialog) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('studentId');

    const studentId =  parseInt(id ?? '-1') ?? -1;

    this.studentService.getStudentById(studentId).subscribe(student => {
      this.student = student;
      this.imagePreviewUrl = this.localdomain +  this.student.photo;
    });
    // console.log('Student:', this.student);
  }

  goTo(): void{
    this.router.navigate(['list']);
  }

// ------------------------------------------------------------------------------------------
 
updateStudent(): void {
  if (!this.student || !this.student.studentId) {
    console.error('No student selected or student ID missing');
    return;
  }
  if (this.selectedFile) {
    this.studentService.updateFile(this.selectedFile, 'photo', `students/${this.student.studentId}`).subscribe({
      next: (photoUrl: string) => {
        if (this.student) { 
          this.student.photo = photoUrl;
          this.performStudentUpdate();
          this.showDialog = false;
        }
      },
      error: (error) => {
        console.error('Error updating photo:', error);
      }
    });
  } else {
    this.performStudentUpdate();
  }
}

performStudentUpdate(): void {
  if (!this.student) {
    return;
  }
  this.student.gender = this.selectedGender;
  this.studentService.updateStudent(this.student.studentId, this.student).subscribe({
    next: (response: any) => {
      console.log('Student updated successfully:', response);
      this.showDialog = false;
    },
    error: (error) => {
      console.error('Error updating student:', error);
    }
  });
}

onFileSelected(event: any): void {
  console.log('Current student:', this.student);
  this.selectedFile = event.target.files[0];

  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  } 
} 
  toggleDialog(): void {
    this.showDialog = !this.showDialog;
  }

}
