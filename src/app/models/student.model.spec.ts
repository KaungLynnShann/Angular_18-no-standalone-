import { Student } from './student.model';

describe('Tutorial', () => {
  it('should create an instance', () => {
    expect(new Student()).toBeTruthy();
  });
});