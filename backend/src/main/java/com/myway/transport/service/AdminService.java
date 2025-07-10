package com.myway.transport.service;

import com.myway.transport.dto.AdminStatsResponse;
import com.myway.transport.entity.User;
import com.myway.transport.repository.ReportRepository;
import com.myway.transport.repository.StationRepository;
import com.myway.transport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private final ReportRepository reportRepository;

    public AdminStatsResponse getGeneralStats() {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        return AdminStatsResponse.builder()
            .totalUsers(userRepository.count())
            .totalStations(stationRepository.count())
            .totalReports(reportRepository.count())
            .newUsersToday(userRepository.countUsersCreatedAfter(oneDayAgo))
            .newReportsToday(reportRepository.countReportsAfter(oneDayAgo))
            .activeUsersThisWeek(userRepository.countActiveUsersAfter(oneWeekAgo))
            .pendingReports(reportRepository.findByStatus(com.myway.transport.entity.Report.ReportStatus.PENDING).size())
            .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setStatus(User.UserStatus.valueOf(status.toUpperCase()));
        return userRepository.save(user);
    }
}
