package levit104.web.lab3;

import lombok.Getter;
import lombok.Setter;

import javax.enterprise.context.ApplicationScoped;
import javax.faces.context.FacesContext;
import javax.inject.Named;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Named
@ApplicationScoped
public class ResultBean {
    private static final String PERSISTENCE_UNIT = "resultsPU";

    private EntityManager entityManager;

    private EntityTransaction entityTransaction;

    @Getter
    @Setter
    private ResultEntity result;

    @Getter
    @Setter
    private List<ResultEntity> results;

    public ResultBean() {
        results = new ArrayList<>();
        result = new ResultEntity();

        connectToDB();
        loadResults();
    }

    public String addResult() {
        try {
            entityTransaction.begin();

            result.areaCheck();
            entityManager.persist(result);
            results.add(result);
            result = new ResultEntity();

            entityTransaction.commit();
        } catch (RuntimeException e) {
            rollback();
            throw e;
        }
        // для корректной работы кнопки обновить
        return "redirect";
    }

    public void addResultFromGraph() {
        try {
            if (result == null) result = new ResultEntity();
            Map<String, String> parameters = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
            entityTransaction.begin();

            result.setX(Double.parseDouble(parameters.get("x")));
            result.setY(Double.parseDouble(parameters.get("y")));
            result.setR(Double.parseDouble(parameters.get("r")));
            result.areaCheck();

            entityManager.persist(result);
            results.add(result);
            result = new ResultEntity();

            entityTransaction.commit();
        } catch (RuntimeException e) {
            rollback();
            throw e;
        }
    }

    public void deleteResults() {
        try {
            entityTransaction.begin();

            entityManager.createQuery("DELETE FROM results").executeUpdate();
            results.clear();

            entityTransaction.commit();
        } catch (RuntimeException e) {
            rollback();
            throw e;
        }
    }

    private void connectToDB() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
        entityManager = entityManagerFactory.createEntityManager();
        entityTransaction = entityManager.getTransaction();
    }

    private void loadResults() {
        try {
            entityTransaction.begin();
            results = entityManager.createQuery("SELECT r FROM results r", ResultEntity.class).getResultList();
            entityTransaction.commit();
        } catch (RuntimeException e) {
            rollback();
            throw e;
        }
    }

    private void rollback() {
        if (entityTransaction.isActive()) entityTransaction.rollback();
    }
}
