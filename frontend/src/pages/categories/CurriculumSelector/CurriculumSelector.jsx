import React, { useEffect, useState } from 'react';
import { getGrades, getPrograms, getStages, getSubjects } from '../api/curriculum';
import styles from './CurriculumSelector.module.css';

import {
    FaBook,
    FaGraduationCap,
    FaLayerGroup,
    FaSchool
} from 'react-icons/fa';

const CurriculumSelector = ({ onSelectionChange, initialValues = {} }) => {
    const [stages, setStages] = useState([]);
    const [grades, setGrades] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [selectedStage, setSelectedStage] = useState(initialValues.stage || '');
    const [selectedGrade, setSelectedGrade] = useState(initialValues.grade || '');
    const [selectedProgram, setSelectedProgram] = useState(initialValues.program || '');
    const [selectedSubject, setSelectedSubject] = useState(initialValues.subject || '');

    useEffect(() => {
        loadStages();
    }, []);

    useEffect(() => {
        if (selectedStage) {
            loadGrades(selectedStage);
        } else {
            setGrades([]);
            setPrograms([]);
            setSubjects([]);
        }
    }, [selectedStage]);

    useEffect(() => {
        if (selectedGrade) {
            loadPrograms(selectedGrade);
        } else {
            setPrograms([]);
            setSubjects([]);
        }
    }, [selectedGrade]);

    useEffect(() => {
        if (selectedProgram) {
            loadSubjects(selectedProgram);
        } else {
            setSubjects([]);
        }
    }, [selectedProgram]);

    useEffect(() => {
        if (selectedSubject && onSelectionChange) {
            onSelectionChange({
                stage: selectedStage,
                grade: selectedGrade,
                program: selectedProgram,
                subject: selectedSubject
            });
        }
    }, [selectedStage, selectedGrade, selectedProgram, selectedSubject]);

    const loadStages = async () => {
        try {
            const data = await getStages();
            setStages(data);
        } catch (error) {
            console.error('Error loading stages:', error);
        }
    };

    const loadGrades = async (stageId) => {
        try {
            const data = await getGrades({ stage: stageId });
            setGrades(data);
            setSelectedGrade('');
            setSelectedProgram('');
            setSelectedSubject('');
        } catch (error) {
            console.error('Error loading grades:', error);
        }
    };

    const loadPrograms = async (gradeId) => {
        try {
            const data = await getPrograms({ grade: gradeId });
            setPrograms(data);
            setSelectedProgram('');
            setSelectedSubject('');
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    };

    const loadSubjects = async (programId) => {
        try {
            const data = await getSubjects({ program: programId });
            setSubjects(data);
            setSelectedSubject('');
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    };

    return (
        <div className={styles.curriculumSelector}>
            <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                    <FaSchool className={styles.labelIcon} />
                    المرحلة
                </label>
                <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className={styles.selectorInput}
                >
                    <option value="">اختر المرحلة</option>
                    {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>
                            {stage.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                    <FaGraduationCap className={styles.labelIcon} />
                    الصف
                </label>
                <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className={styles.selectorInput}
                    disabled={!selectedStage}
                >
                    <option value="">اختر الصف</option>
                    {grades.map(grade => (
                        <option key={grade.id} value={grade.id}>
                            {grade.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                    <FaLayerGroup className={styles.labelIcon} />
                    البرنامج
                </label>
                <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className={styles.selectorInput}
                    disabled={!selectedGrade}
                >
                    <option value="">اختر البرنامج</option>
                    {programs.map(program => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                    <FaBook className={styles.labelIcon} />
                    المادة
                </label>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className={styles.selectorInput}
                    disabled={!selectedProgram}
                >
                    <option value="">اختر المادة</option>
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CurriculumSelector;