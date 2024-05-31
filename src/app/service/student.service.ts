import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

const apiUrl = 'http://localhost:8080/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${apiUrl}/get/all`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${apiUrl}/get/${id}`);
  }

  getAllByStudentName(studentName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${apiUrl}/name?studentName=${studentName}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${apiUrl}/create`, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${apiUrl}/update/${id}`, student);
  }

    deleteStudent(id: number): Observable<any> {
    return this.http.delete<Student>(`${apiUrl}/delete/${id}`);
  }

  import(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${apiUrl}/import`, formData);
  }

  createFile(file: File, fileType: string,options: any = {}): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    const requestOptions = { responseType: 'text' as 'json' };
    return this.http.post<string>(`${apiUrl}/file/create`, formData,requestOptions);
  }

  updateFile(file: File, fileType: string, filePath: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('filePath', filePath);
    const requestOptions = { responseType: 'text' as 'json' };
    return this.http.put<string>(`${apiUrl}/file/update`,formData,requestOptions);
  }

  export(): Observable<Blob> {
    return this.http.get(`${apiUrl}/export`, { responseType: 'blob' });
  }
}
