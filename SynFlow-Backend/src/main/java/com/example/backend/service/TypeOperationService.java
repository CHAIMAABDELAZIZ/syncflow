package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.model.TypeOperation;
import com.example.backend.repository.PhaseRepository;
import com.example.backend.repository.TypeOperationRepository;

@Service
@Transactional
public class TypeOperationService {

    @Autowired
    private TypeOperationRepository typeOperationRepository;
    
    @Autowired
    private PhaseRepository phaseRepository;

    public List<TypeOperation> findAll() {
        return typeOperationRepository.findAll();
    }

    public Optional<TypeOperation> findByCode(String code) {
        return typeOperationRepository.findById(code);
    }

    public TypeOperation create(TypeOperation typeOperation) {
        return typeOperationRepository.save(typeOperation);
    }

    public Optional<TypeOperation> update(String code, TypeOperation typeOperationData) {
        return typeOperationRepository.findById(code)
            .map(typeOperation -> {
                if (typeOperationData.getNom() != null) {
                    typeOperation.setNom(typeOperationData.getNom());
                }
                if (typeOperationData.getDescription() != null) {
                    typeOperation.setDescription(typeOperationData.getDescription());
                }
                
                return typeOperationRepository.save(typeOperation);
            });
    }

    public boolean delete(String code) {
        return typeOperationRepository.findById(code)
            .map(typeOperation -> {
                typeOperationRepository.delete(typeOperation);
                return true;
            })
            .orElse(false);
    }
}
