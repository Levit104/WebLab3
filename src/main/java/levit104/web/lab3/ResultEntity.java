package levit104.web.lab3;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "results")
@Getter
@Setter
public class ResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Double x;

    private Double y;

    private Double r;

    private String hitFactor;

    public void areaCheck() {
        hitFactor = insideArea() ? "Попадание" : "Промах";
    }

    private boolean insideArea() {
        return insideRectangle() || insideQuadrant() || insideTriangle();
    }

    private boolean insideRectangle() {
        return x >= 0 && y >= 0 && x <= r && y <= r / 2;
    }

    private boolean insideQuadrant() {
        return x >= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= r / 2;
    }

    private boolean insideTriangle() {
        return x <= 0 && y >= 0 && y <= x + r;
    }
}
