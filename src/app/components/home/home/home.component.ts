import { Component } from '@angular/core';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../service/student.service';
import { Gender } from '../../../models/gender.enum';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  localDomain = 'http://localhost:8080';

  imagePreviewUrl: string | undefined;

  genderEnum = Gender;
  selectedGender: Gender = Gender.Male;

  student: Student = {
    date: new Date(),
    studentId: 0,
    studentName: '',
    studentNrc: '',
    age: 0,
    dateOfBirth: new Date(),
    fatherName: '',
    gender: Gender.Male,
    address: '',
    township: '',
    photo: ''
  };
  submitted = false;

  constructor (private studentService: StudentService) {  }

  saveStudent(): void {
    const data = {
      date: this.student.date,
      studentName: this.student.studentName,
      studentNrc: this.student.studentNrc,
      age: this.student.age,
      dateOfBirth: this.student.dateOfBirth,
      fatherName: this.student.fatherName,
      gender: this.student.gender = this.selectedGender,
      address: this.student.address,
      township: this.student.township,
      photo: this.student.photo
    };
  
    // console.log('Data to be sent:', data);
  
    if (!this.student.studentName || !this.student.studentNrc) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }
  
    this.studentService.createStudent(data).subscribe({
      next: (response) => {
        this.submitted = true;
        swal.fire({
          icon: 'success',
          title: 'Great!',
          text: 'Student information input successfully',
        }).then(() => {
          window.location.reload(); 
        });
      },
      error: (error) => {
        console.error('Error creating student:', error);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while creating the student.',
        });
      }
    });
  }  
  // newStudent(): void {
  //   this.submitted = false;
  //   this.student = {
  //     date: new Date(),
  //     studentId: 0,
  //     studentName: '',
  //     studentNrc: '',
  //     age: 0,
  //     dateOfBirth: new Date(),
  //     fatherName: '',
  //     gender: Gender.Male,
  //     address: '',
  //     township: '',
  //     photo: ''
  //   };
  // };
  onCancel(): void {
    this.submitted = false;
    window.location.reload();
  };

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {

        this.student.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      const options = { responseType: 'text' as 'json' };;
      this.studentService.createFile(file, 'image',options).subscribe({
        next: (response: any) => {
          const filePath = response; 
          if (filePath) {
            console.log('File uploaded successfully:', filePath);
            this.student.photo = filePath;
          }
        },
        error: (error) => {
          
          console.error('Error uploading file:', error);
        }
      });

      this.imagePreviewUrl = imageUrl;
    }
  }
}


